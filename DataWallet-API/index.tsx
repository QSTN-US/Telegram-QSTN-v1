import Layout from '@components/Common/Layout';
import MetaTags from '@components/Common/MetaTags';
import { useAuth } from '@components/Hooks/useAuth';
import Loading from '@components/Shared/Loading';
import { yupResolver } from '@hookform/resolvers/yup';
import { Mixpanel } from '@lib/mixpanel';
import { redirectUser } from '@lib/onBoarding';
import { PAGEVIEW } from '@lib/tracking';
import { delay } from '@lib/utils';
import { API_SERVER_URL, API_URL, APP_NAME } from '@qstn/data/constants';
import type { Wallet } from '@qstn/graphql';
import { OnBoardingStatus, useUserWalletLazyQuery } from '@qstn/graphql';
import { useAppPersistStore, useAppStore } from '@store/app';
import axios from 'axios';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { QRCode } from 'react-qr-svg';
import * as yup from 'yup';

// validation schema
const schema = yup.object().shape({
  email: yup
    .string()
    .required('Please enter your email')
    .email('Please enter a valid email Address')
});

const ConnectDataWallet: NextPage = () => {
  const { handleLogin, accessToken, refreshToken } = useAuth();

  const [magic, setMagic] = useState<any>();
  const [authRequest, setAuthRequest] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isPoolingAuthResponse, setIsPoolingAuthResponse] = useState<boolean>();
  const setUsers = useAppStore((state) => state.setUsers);
  const setCurrentUser = useAppStore((state) => state.setCurrentUser);
  const setIssuerId = useAppPersistStore((state) => state.setIssuerId);
  const setProfileId = useAppPersistStore((state) => state.setProfileId);
  const setProfileDisplayName = useAppPersistStore(
    (state) => state.setProfileDisplayName
  );
  const setProfileType = useAppPersistStore((state) => state.setProfileType);
  const setProfileAvatar = useAppPersistStore(
    (state) => state.setProfileAvatar
  );

  const setProfileStatus = useAppPersistStore(
    (state) => state.setProfileStatus
  );
  const currentProfileType = useAppPersistStore((state) => state.profileType);
  const currentProfileStatus = useAppPersistStore(
    (state) => state.profileStatus
  );
  const currentProfileId = useAppPersistStore((state) => state.profileId);
  const setWallet = useAppPersistStore((state) => state.setWallet);
  const [
    getUserWallet,
    { error: errorUserWallet, loading: loadingUserWallet }
  ] = useUserWalletLazyQuery({
    fetchPolicy: 'no-cache'
  });

  const serverUrl = API_URL;
  const router = useRouter();

  const getAuthRequest = async () => {
    const apiUrl = `${API_SERVER_URL}/did/sign-in`;

    try {
      const response = await axios.get(apiUrl);
      console.log('getAuthRequest ==>', response.data);
      if (response.data?.id) {
        //success
        setAuthRequest(response.data);
      }
      return response.data;
    } catch (error: any) {
      console.error('Error not did data:', error);
    }

    return false;
  };

  const getAuthStatus = async () => {
    const sessionId = Number(
      `${authRequest?.body?.callbackUrl}`.split('sessionId=')[1]
    );
    const apiUrl = `${API_SERVER_URL}/did/status?sessionId=${sessionId}`;

    try {
      const response = await axios.get(apiUrl);
      console.log('getAuthStatus ==>', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error not did data:', error);
    }

    return false;
  };

  const setAuthSession = async (authResponse: any) => {
    const apiUrl = `${API_URL}/auth/session`;
    console.log('setAuthSession ==>', apiUrl);
    try {
      const response = await axios.post(apiUrl, { authResponse });
      console.log('setAuthSession ==>', response.data);
      sessionStorage.setItem(
        'AUTH',
        JSON.stringify(response.data?.result.AUTH)
      );
      return response.data;
    } catch (error: any) {
      console.error('Error session not saved:', error);
    }

    return false;
  };

  const walletLogin = async (id: string, didToken: string) => {
    const result = await fetch(`${serverUrl}/user/login`, {
      headers: new Headers({
        Jwz: 'Bearer ' + didToken
      }),
      credentials: 'same-origin',
      method: 'POST',
      body: JSON.stringify({
        email: id
      }) as any
    });

    return result.json();
  };

  const poolingAuthResponse = async () => {
    let auth;
    while (true) {
      auth = await getAuthStatus();
      console.log('poolingAuthResponse ==>', auth);
      if (auth?.id) {
        //await setAuthSession(auth)
        console.log('Wallet is logged ==>', auth?.id);
        sessionStorage.setItem('AUTH', JSON.stringify(auth));
        const isLogged = await walletLogin(auth?.id, auth?.jwz);
        console.log('isLogged ==>', isLogged);
        if (!isLogged.user) {
          setProfileId('0');
          setProfileType('UNKNOWNWALLET');
          setProfileStatus('PENDING');
          router.push('/');
          return;
        }

        const { user, logged } = isLogged;
        const handledLogin = await handleLogin(logged.email, logged.signature);
        setCurrentUser(user);
        setProfileId(user.profileId);
        setProfileDisplayName(user.displayName);
        setProfileType(user.accountType);
        setProfileStatus(user.accountStatus);
        user?.avatar && setProfileAvatar(user.avatar);
        setIssuerId(user.issuer);
        //console.log("isLogged", isLogged);

        const updateWallet = async () => {
          const { data: userWalletData } = await getUserWallet({
            variables: {
              request: {
                profileId: user.profileId
              }
            }
          });
          //console.log(usersData);
          if (userWalletData) {
            setWallet(userWalletData.userWallet as Wallet);
          }
        };
        updateWallet();

        // check user status and onboarding status
        if (user.accountStatus === 'PENDING') {
          router.push(
            redirectUser({
              accountStatus: user.accountStatus,
              onboardingStatus: OnBoardingStatus.Pending
            })
          );
        }

        // check user status and onboarding status
        if (user.accountStatus === 'PENDING') {
          if (user.accountType === 'BUSINESS') {
            router.push('/onboarding/business');
          } else {
            router.push('/onboarding/user');
          }
        } else {
          if (user.accountType === 'BUSINESS') {
            router.push('/business/surveys');
          } else {
            router.push('/survey-marketplace');
          }
        }

        // onboarding tutorial survey pending
        // -> redirect to onboarding survey step

        // onboarding tutorial survey complete
        // -> redirect to onboarding survey reward notification step

        // onboading near wallet selection/skip pending
        // -> redirect to onboarding wallet selection step

        // onboarding onboarding status complete
        // -> redirect to survey marketplace
        //TODO
        //router.push("/survey-marketplace");

        break;
      }

      await delay(3000);
    }
  };

  const fetchData = async () => {
    await getAuthRequest();
  };

  useEffect(() => {
    fetchData();
    Mixpanel.track(PAGEVIEW, { page: 'wallet auth page' });
  }, []);

  useEffect(() => {
    console.log('authRequest', authRequest);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { isValid, errors, touchedFields }
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  /*const submitForm: any = async (formData: any) => {
    setLoading(true);
    try {
      const isLogged = await walletLogin();
      const { user, logged } = isLogged;

      const handledLogin = await handleLogin(logged.email, logged.signature);
      //console.log(handledLogin);
      //localStorage.setItem("accessToken", logged.accessToken);
      //localStorage.setItem("refreshToken", logged.refreshToken);
      //Cookies.set('accessToken', logged.accessToken, { secure: true, sameSite: 'strict' });
      //Cookies.set('refreshToken', logged.refreshToken, { secure: true, sameSite: 'strict' });

      setCurrentUser(user);
      setProfileId(user.profileId);
      setProfileDisplayName(user.displayName);
      setProfileType(user.accountType);
      setProfileStatus(user.accountStatus);
      user?.avatar && setProfileAvatar(user.avatar);
      setIssuerId(user.issuer);
      //console.log("isLogged", isLogged);

      const updateWallet = async () => {
        const { data: userWalletData } = await getUserWallet({
          variables: {
            request: {
              profileId: user.profileId,
            },
          },
        });
        //console.log(usersData);
        if (userWalletData) setWallet(userWalletData.userWallet as Wallet);
      };
      updateWallet();

      // check user status and onboarding status
      if (user.accountStatus === "PENDING") {
        router.push(
          redirectUser({
            accountStatus: user.accountStatus,
            onboardingStatus: OnBoardingStatus.Pending,
          })
        );
      }

      // check user status and onboarding status
      if (user.accountStatus === "PENDING" && user.accountType === "BUSINESS") {
        router.push("/onboarding/business");
      }


      // onboarding tutorial survey pending
      // -> redirect to onboarding survey step

      // onboarding tutorial survey complete
      // -> redirect to onboarding survey reward notification step

      // onboading near wallet selection/skip pending
      // -> redirect to onboarding wallet selection step

      // onboarding onboarding status complete
      // -> redirect to survey marketplace
      //TODO
      router.push("/survey-marketplace");
    } catch (error: any) {
      setLoading(false);
      console.log(error);
    }
  };*/

  const signInClick = async (jsonData: any) => {
    //const currCaller = ? "iden3comm://" : window.location;
    const currCaller = 'iden3comm://';
    const t = `${currCaller}?i_m=${
        jsonData ? btoa(JSON.stringify(jsonData)) : ''
      }`,
      i = new CustomEvent('authEvent', {
        detail: t
      });
    window.document.dispatchEvent(i), (window.document.location.href = t);
    setIsPoolingAuthResponse(true);
    await poolingAuthResponse();
  };

  return authRequest ? (
    <Layout>
      <MetaTags title={`Data Wallet Login • ${APP_NAME}`} />
      <div className="items-center justify-center bg-[#FCFCFD]">
        <div className="auth-page-container container relative mx-auto">
          <div className="font-poppins mx-auto flex w-[339px] flex-col items-center justify-center gap-2">
            <h2 className=" font-segoe-ui text-3xl tracking-[-1px]">
              Authentication
            </h2>

            {isPoolingAuthResponse ? (
              <>
                <div className="mx-auto mt-12 flex h-24 w-24 items-center justify-center rounded-full bg-slate-50 p-1">
                  <svg
                    className="text-navy-300 h-20 w-20 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx={12}
                      cy={12}
                      r={10}
                      stroke="currentColor"
                      strokeWidth={4}
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Authenticating, please wait...
                  </h3>
                </div>
              </>
            ) : (
              <>
                <div className="focus-within:ring-navy-300 relative mb-6 w-full rounded-xl border border-gray-50 bg-white px-4 py-4 shadow-md focus-within:ring-2 focus-within:ring-offset-2 hover:border-gray-400">
                  <QRCode
                    level="Q"
                    style={{ width: 300 }}
                    value={JSON.stringify(authRequest)}
                  />
                </div>
                <p className="my-2 text-center text-[11px] font-semibold text-[#B1B5C4]">
                  Login using Data Wallet (aka. Cubby)
                </p>
                <button
                  type="button"
                  onClick={() => signInClick(authRequest)}
                  className="bg-navy-300 hover:bg-navy-500 focus-visible:outline-navy-300 flex w-full rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <Image
                    className="mr-3 h-5 w-5"
                    src="/favicon-32x32.png"
                    alt="QSTN powers an ecosystem where users answer questions, earn credits and spend these rewards within our digital environment."
                    width={32}
                    height={32}
                  />
                  Connect QSTN
                </button>

                <p className="mt-6 text-xs text-[#777E91]">
                  By clicking login, or continuing with the other options below,
                  you agree to QSTN&apos;s{' '}
                  <span className="text-navy-300">Terms of Service</span> and
                  have read the{' '}
                  <span className="text-navy-300">Privacy Policy</span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  ) : (
    <Loading />
  );
};

export default ConnectDataWallet;

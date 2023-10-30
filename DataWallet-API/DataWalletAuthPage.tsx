import { classNames } from '@lib/utils';
import {
  approveMethod,
  invokeContractMethod,
  proofMethod,
  receiveMethod
} from '@pages/api/did/Approve.service';
import { byteEncoder, hideString } from '@pages/api/did/utils';
import { Base64 } from 'js-base64';
import { usePathname } from 'next/navigation';
import Router, { useRouter } from 'next/router';
import type { FC } from 'react';
import { Fragment, useEffect, useState } from 'react';

import { CredentialRowDetail } from './credentials';
import Logo from './credentials/Logo.png';

interface InfoDataWalletAuth {
  accounts: any;
  currentAccount: any;
  packageMgr: any;
  dataStorage: any;
}

const RequestType = {
  Auth: 'auth',
  CredentialOffer: 'credentialOffer',
  Proof: 'proof',
  ProofContractInvokeRequest: 'proofContractInvokeRequest'
};

const getTitle = (requestType: any) => {
  switch (requestType) {
    case RequestType.Auth:
      return 'Authorization';
    case RequestType.CredentialOffer:
      return 'Receive Claim';
    case RequestType.Proof:
      return 'Proof request';
    case RequestType.ProofContractInvokeRequest:
      return 'Proof Contract Request';
    default:
      return 'Invalid Request!';
  }
};

const DataWalletAuthPage: FC<InfoDataWalletAuth> = (props) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState<any>();
  const { accounts, packageMgr, dataStorage } = props;
  //const searchParams = useSearchParams();
  //const search = searchParams.get('search');
  const pathname = usePathname();
  const router = useRouter();
  const urlData = query;
  const [currentAccount, setCurrentAccount] = useState('');
  const [error, setError] = useState(null);
  const [requestType, setRequestType] = useState<any>('');
  const [data, setData] = useState<any>(null);
  const [isReady, setIsReady] = useState(true);
  const [originalUrl, setOriginalUrl] = useState(null);

  const detectRequest = (unpackedMessage: any) => {
    const { type, body } = unpackedMessage;
    const { scope = [], transaction_data } = body;

    //console.log('SCOPE ==>', scope, body, transaction_data);

    if (type.includes('request') && scope.length && transaction_data === null) {
      return RequestType.Proof;
    } else if (type.includes('contract') && transaction_data !== null) {
      return RequestType.ProofContractInvokeRequest;
    } else if (type.includes('offer')) {
      return RequestType.CredentialOffer;
    } else if (type.includes('request')) {
      return RequestType.Auth;
    }
  };

  async function handleClickReject() {
    router.back();
    setOpen(false);
  }

  async function handleClickApprove() {
    setIsReady(false);
    let result = await approveMethod(originalUrl);
    if (result.code !== 'ERR_NETWORK') {
      //router.back();
      setOpen(false);
    } else {
      setError(result.message);
      setIsReady(true);
      setOpen(false);
    }
  }

  async function handleClickProof() {
    setIsReady(false);
    try {
      await proofMethod(originalUrl);
      router.back();
    } catch (error: any) {
      console.log(error.message);
      setError(error.message);
    } finally {
      setIsReady(true);
    }
  }

  async function handleClickContractProof() {
    setIsReady(false);
    try {
      await invokeContractMethod(originalUrl);
      router.back();
    } catch (error: any) {
      console.log(error.message);
      setError(error.message);
    } finally {
      setIsReady(true);
    }
  }

  async function handleClickReceive() {
    setIsReady(false);
    let result: any = await receiveMethod(originalUrl).catch((error) =>
      setError(error)
    );
    if (result === 'SAVED') {
      //router.push('/');
      setOpen(false);
      setTimeout(() => {
        Router.reload();
        router.back();
      }, 2000);
    } else {
      setError(result.message);
      setIsReady(true);
    }
  }

  const getCredentialRequestData = () => {
    const { body } = data;
    const { scope = [] } = body;
    return scope.map(({ circuitId, query }: any) => {
      let data = [];
      data.push({
        name: 'Credential type',
        value: query.type
      });
      query.credentialSubject &&
        data.push({
          name: 'Requirements',
          value: Object.keys(query.credentialSubject).reduce((acc, field) => {
            const filter = query.credentialSubject[field];
            const filterStr: any = Object.keys(filter).map((operator) => {
              return `${field} - ${operator} ${filter[operator]}\n`;
            });
            return acc.concat(filterStr);
          }, '')
        });
      data.push({
        name: 'Allowed issuers',
        value: query.allowedIssuers.join(', ')
      });
      data.push({
        name: 'Proof type',
        value: circuitId
      });
      return data;
    });
  };

  useEffect(() => {
    document.addEventListener('authEvent', function (e: any) {
      console.log(e.detail.split('i_m=')[1]);
      setQuery(e.detail.split('i_m=')[1]);
      setOpen(true);
    });
  }, [dataStorage, packageMgr]);

  useEffect(() => {
    // get active account
    //let accounts = JSON.parse(localStorage.getItem('accounts'));
    let accountActive = accounts.filter((acc: any) => acc.isActive);
    console.log('accounts ==>', accountActive);
    setCurrentAccount(accountActive[0]?.did);
    // fix twice call
    let ignore = false;
    const fetchData = async () => {
      if (query) {
        const msgBytes = byteEncoder.encode(Base64.decode(query));
        const { unpackedMessage } = await packageMgr.unpack(msgBytes);
        if (!ignore) {
          console.log('unpackedMessage', unpackedMessage);
          setOriginalUrl(query);
          setData(unpackedMessage);
          setRequestType(detectRequest(unpackedMessage));
        }
      }
    };

    dataStorage?.identity
      .getAllIdentities()
      .then((_identity: any) => {
        if (_identity.length <= 0) {
          //navigate("/welcome", { state: pathname + search });
        } else {
          fetchData().catch(console.error);
        }
      })
      .catch(console.error);

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, accounts]);

  return (
    <div
      className={classNames(
        'bg-qstn-50 fixed inset-0 h-full min-h-screen w-full flex-col justify-center overflow-y-auto px-4 py-6 sm:py-12',
        open ? 'flex' : 'hidden'
      )}
    >
      <div className="py-3 sm:mx-auto sm:max-w-xl">
        <div className="min-w-1xl flex flex-col items-center rounded-xl border border-gray-50 bg-white shadow-md">
          <div className="grid grid-flow-col grid-cols-1 p-6">
            <div className="px-4 py-5 sm:p-6">
              <form
                className={classNames(
                  'h-full flex-col',
                  open ? 'flex' : 'hidden'
                )}
              >
                <div className="h-0 flex-1 overflow-y-auto">
                  <div className="bg-navy-300 px-4 py-6 sm:px-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-white">
                        Authorization
                      </h3>
                      {/*<div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="bg-navy-300 rounded-md text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                              onClick={() => setOpen(false)}
                            >
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>*/}
                    </div>
                    {/*<div className="mt-1">
                          <p className="text-sm text-indigo-300 truncate">
                            {accounts ? accounts[0]?.did : '...'}
                          </p>
                        </div>*/}
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="divide-y divide-gray-200 px-4 sm:px-6">
                      <div className="space-y-6 pb-3 pt-1">
                        <div className={'auth-wrapper'}>
                          <div className="grid grid-cols-3 align-middle">
                            <div className="auth-logo">
                              <img
                                src={Logo.src}
                                alt={'Data Wallet (aka. Cubby)'}
                                style={{ width: '64px' }}
                              />
                            </div>
                            <div className="mt-2">
                              <h3>QSTN Network</h3>
                              <h2>{getTitle(requestType)}</h2>
                            </div>
                          </div>

                          <div className="auth-box">
                            {/*<Avatar sx={{ width: 36, height: 36 }}/>*/}
                            <span style={{ fontWeight: 'bold' }}>
                              {currentAccount
                                ? hideString(currentAccount)
                                : 'loading...'}
                            </span>
                          </div>

                          <div
                            className="progress-indicator"
                            style={{ height: 20 }}
                          >
                            {/*!isReady && <LinearProgress size={progressHeight} />*/}
                          </div>
                          <div className={'error'}>
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                          </div>
                          {requestType && requestType === RequestType.Proof && (
                            <>
                              {isReady ? (
                                <div className="auth-box-message">
                                  <p className={'request-proof'}>
                                    <b>This organization</b> requests a valid
                                    proof of next credential for{' '}
                                    <b>{data.body.reason}</b>
                                  </p>
                                  {getCredentialRequestData().map(
                                    (oneCredentialRequest: any) => {
                                      return oneCredentialRequest.map(
                                        (data: any, index: number) => {
                                          return (
                                            <CredentialRowDetail
                                              key={index}
                                              {...data}
                                            />
                                          );
                                        }
                                      );
                                    }
                                  )}
                                </div>
                              ) : (
                                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-slate-50">
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
                              )}

                              <div className={'button-section'}>
                                <button
                                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                  disabled={!isReady}
                                  onClick={handleClickProof}
                                >
                                  Sign
                                </button>
                                <button
                                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                  onClick={handleClickReject}
                                >
                                  Cancel
                                </button>
                              </div>
                            </>
                          )}
                          {requestType &&
                            requestType ===
                              RequestType.ProofContractInvokeRequest && (
                              <>
                                <div className="auth-box-message">
                                  <p className={'request-proof'}>
                                    <b>This organization</b> requests a valid
                                    proof of next credential for{' '}
                                    <b>{data.body.reason}</b>
                                  </p>
                                  {getCredentialRequestData().map(
                                    (oneCredentialRequest: any) => {
                                      return oneCredentialRequest.map(
                                        (data: any, index: number) => {
                                          return (
                                            <CredentialRowDetail
                                              key={index}
                                              {...data}
                                            />
                                          );
                                        }
                                      );
                                    }
                                  )}
                                </div>
                                <div className={'button-section'}>
                                  <button
                                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    disabled={!isReady}
                                    onClick={handleClickContractProof}
                                  >
                                    Sign Proof
                                  </button>
                                  <button
                                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    onClick={handleClickReject}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </>
                            )}
                          {requestType && requestType === RequestType.Auth && (
                            <>
                              {isReady ? (
                                <div className="auth-box-message">
                                  <p className={'reason'}>
                                    Reason : {data.body.reason}
                                  </p>
                                  <p className={'from'}>From : {data.from}</p>
                                </div>
                              ) : (
                                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-slate-50">
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
                              )}

                              <div className="justify-center">
                                <button
                                  className="w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-bold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                  disabled={!isReady}
                                  onClick={handleClickApprove}
                                >
                                  Approve
                                </button>
                                <button
                                  className="mt-3 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-bold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                  onClick={handleClickReject}
                                >
                                  Reject
                                </button>
                              </div>
                            </>
                          )}
                          {requestType &&
                            requestType === RequestType.CredentialOffer && (
                              <>
                                {isReady ? (
                                  <div className="auth-box-message">
                                    <p className={'from'}>From : {data.from}</p>
                                    <h3>Credentails:</h3>
                                    {data.body.credentials.map((cred: any) => (
                                      <div
                                        key={cred.id}
                                        style={{
                                          border: '1px solid black',
                                          borderRadius: '10px',
                                          padding: '5px'
                                        }}
                                      >
                                        <p>{cred.description}</p>
                                        <p>{cred.id}</p>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-slate-50">
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
                                )}

                                <div className={'button-section'}>
                                  <button
                                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    disabled={!isReady}
                                    onClick={handleClickReceive}
                                  >
                                    Receive
                                  </button>
                                  <button
                                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    onClick={handleClickReject}
                                  >
                                    Decline
                                  </button>
                                </div>
                              </>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataWalletAuthPage;

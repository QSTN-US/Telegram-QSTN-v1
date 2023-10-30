import { Dialog, Transition } from '@headlessui/react';
import { QuestionMarkCircleIcon } from '@heroicons/react/20/solid';
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

const DataWalletAuth: FC<InfoDataWalletAuth> = (props) => {
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
    //router.push('/');
    setOpen(false);
  }

  async function handleClickApprove() {
    setIsReady(false);
    let result = await approveMethod(originalUrl);
    if (result.code !== 'ERR_NETWORK') {
      //router.push('/');
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
      //router.push('/');
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
      //router.push('/');
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
      //setOpen(true);
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
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <form className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                    <div className="h-0 flex-1 overflow-y-auto">
                      <div className="bg-navy-300 px-4 py-6 sm:px-6">
                        <div className="flex items-center justify-between">
                          <Dialog.Title className="text-lg font-medium text-white">
                            Authorization
                          </Dialog.Title>
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
                                {error && (
                                  <p style={{ color: 'red' }}>{error}</p>
                                )}
                              </div>
                              {requestType &&
                                requestType === RequestType.Proof && (
                                  <>
                                    {isReady ? (
                                      <div className="auth-box-message">
                                        <p className={'request-proof'}>
                                          <b>This organization</b> requests a
                                          valid proof of next credential for{' '}
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
                                        <b>This organization</b> requests a
                                        valid proof of next credential for{' '}
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
                              {requestType &&
                                requestType === RequestType.Auth && (
                                  <>
                                    {isReady ? (
                                      <div className="auth-box-message">
                                        <p className={'reason'}>
                                          Reason : {data.body.reason}
                                        </p>
                                        <p className={'from'}>
                                          From : {data.from}
                                        </p>
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
                                        onClick={handleClickApprove}
                                      >
                                        Approve
                                      </button>
                                      <button
                                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
                                        <p className={'from'}>
                                          From : {data.from}
                                        </p>
                                        <h3>Credentails:</h3>
                                        {data.body.credentials.map(
                                          (cred: any) => (
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
                                          )
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

                          <div className="pb-6 pt-4">
                            {/*<div className="flex text-sm">
                              <a
                                href="#"
                                className="text-navy-600 hover:text-navy-700 group inline-flex items-center font-medium"
                              >
                                <LinkIcon
                                  className="text-navy-300 group-hover:text-navy-500 h-5 w-5"
                                  aria-hidden="true"
                                />
                                <span className="ml-2">
                                  Copy data wallet address
                                </span>
                              </a>
                                          </div>*/}
                            <div className="mt-4 flex text-sm">
                              <a
                                href="#"
                                className="group inline-flex items-center text-gray-500 hover:text-gray-900"
                              >
                                <QuestionMarkCircleIcon
                                  className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                  aria-hidden="true"
                                />
                                <span className="ml-2">
                                  Learn more about data wallet
                                </span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 justify-end px-4 py-4">
                      <button
                        type="button"
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={() => setOpen(false)}
                      >
                        Close
                      </button>
                      {/*<button
                        type="submit"
                        className="ml-4 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Save
                          </button>*/}
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default DataWalletAuth;

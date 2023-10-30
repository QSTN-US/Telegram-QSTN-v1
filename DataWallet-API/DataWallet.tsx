import { Dialog, Transition } from '@headlessui/react';
import { QuestionMarkCircleIcon } from '@heroicons/react/20/solid';
import { useAppPersistStore } from '@store/app';
import Router from 'next/router';
import type { FC } from 'react';
import { Fragment, useEffect, useState } from 'react';

import { CredentialsInfo } from './credentials';

interface InfoDataWallet {
  accounts: any;
  currentAccount: any;
  credentials: any;
  credentialsGroups: any;
}

const DataWallet: FC<InfoDataWallet> = (props) => {
  const { accounts, currentAccount, credentials, credentialsGroups } = props;
  const [open, setOpen] = useState(false);
  const isDataWalletOpen = useAppPersistStore((state) => state.openDataWallet);
  const openDataWallet = useAppPersistStore((state) => state.setOpenDataWallet);

  useEffect(() => {}, [isDataWalletOpen]);

  return (
    <Transition.Root show={isDataWalletOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={openDataWallet}>
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
                            {accounts ? accounts[0]?.name : 'QSTN Wallet'}
                          </Dialog.Title>
                          {/*<div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="bg-navy-300 rounded-md text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                              onClick={() => openDataWallet(false)}
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
                            <CredentialsInfo
                              credentials={credentials}
                              credentialsGroups={credentialsGroups}
                            />
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
                        onClick={() => openDataWallet(false)}
                      >
                        Close
                      </button>
                      <button
                        onClick={() => Router.reload()}
                        type="button"
                        className="ml-4 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Refresh
                      </button>
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

export default DataWallet;

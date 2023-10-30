import { Dialog, Transition } from '@headlessui/react';
import { LinkIcon, QuestionMarkCircleIcon } from '@heroicons/react/20/solid';
import { useAppPersistStore } from '@store/app';
import Image from 'next/image';
import Link from 'next/link';
import Router from 'next/router';
import type { FC } from 'react';
import { Fragment, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

interface InfoCreateDataWallet {
  seedPhrase: any;
  createWalletAccount: any;
}

const CreateDataWallet: FC<InfoCreateDataWallet> = ({
  seedPhrase,
  createWalletAccount
}) => {
  const [open, setOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string>('');
  const isCreatingDataWallet = useAppPersistStore(
    (state) => state.createDataWallet
  );
  const createDataWallet = useAppPersistStore(
    (state) => state.setCreateDataWallet
  );

  const copyToClipBoard = async (copyMe: string) => {
    try {
      await navigator.clipboard.writeText(copyMe);
      setCopySuccess('Copied!');
      toast.success('Copied!');
    } catch (error) {
      setCopySuccess('Failed to copy!');
    }
  };

  useEffect(() => {}, [isCreatingDataWallet]);

  return (
    <Transition.Root show={isCreatingDataWallet} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={createDataWallet}>
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
                            Create QSTN Data Wallet
                          </Dialog.Title>
                          {/*<div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="bg-navy-300 rounded-md text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                              onClick={() => createDataWallet(false)}
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
                          <button
                            onClick={() => copyToClipBoard(`${seedPhrase}`)}
                          >
                            <div className="bg-qstn-100 space-y-6 p-3">
                              {seedPhrase}
                            </div>
                          </button>

                          <div className="pb-6 pt-4 text-center">
                            <span className="text-navy-300 mt-6 text-xs font-bold">
                              Click button bellow to create your data wallet
                            </span>
                            <br className="mt-2" />

                            <button
                              onClick={() => createWalletAccount(seedPhrase)}
                              type="button"
                              className="mt-1 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2"
                            >
                              <Image
                                className="mr-3 w-[24px]"
                                width={24}
                                height={24}
                                alt="near wallet"
                                src="/assets/images/reward.png"
                              />
                              Create a Data Wallet
                            </button>
                          </div>

                          <div className="pb-6 pt-4">
                            <div className="flex text-sm">
                              <button
                                onClick={() => copyToClipBoard(`${seedPhrase}`)}
                                className="text-navy-600 hover:text-navy-700 group inline-flex items-center font-medium"
                              >
                                <LinkIcon
                                  className="text-navy-300 group-hover:text-navy-500 h-5 w-5"
                                  aria-hidden="true"
                                />
                                <span className="ml-2">
                                  Copy your seed phrase.
                                </span>
                              </button>
                            </div>
                            <div className="mt-4 flex text-sm">
                              <Link
                                href="/about-datawallet"
                                className="group inline-flex items-center text-gray-500 hover:text-gray-900"
                              >
                                <QuestionMarkCircleIcon
                                  className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                  aria-hidden="true"
                                />
                                <span className="ml-2">
                                  Learn more about data wallet
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 justify-end px-4 py-4">
                      <button
                        type="button"
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={() => createDataWallet(false)}
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

export default CreateDataWallet;

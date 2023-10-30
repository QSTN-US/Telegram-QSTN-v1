import { useAppPersistStore } from '@store/app';
import type { FC } from 'react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useUpdateEffect } from 'usehooks-ts';

interface InfoCreateDataWallet {
  seedPhrase: any;
  createWalletAccount: any;
}

const CreateDataWalletLoader: FC<InfoCreateDataWallet> = ({
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

  useUpdateEffect(() => {
    if (isCreatingDataWallet === true && seedPhrase !== null) {
      createWalletAccount(seedPhrase);
      createDataWallet(false);
    }
  });

  return isCreatingDataWallet === true && seedPhrase === null ? <div /> : null;
};

export default CreateDataWalletLoader;

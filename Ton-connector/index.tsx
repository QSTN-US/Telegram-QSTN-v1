import { THEME, TonConnectUIProvider } from '@tonconnect/ui-react';
import React from 'react';

// Provider
// ========================================================
const TonNetworkProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <TonConnectUIProvider
      manifestUrl="./tonconnect-manifest.json"
      uiPreferences={{ theme: THEME.LIGHT }}
      actionsConfiguration={{
        twaReturnUrl: 'https://t.me/tc_twa_test_bot'
      }}
    >
      {children}
    </TonConnectUIProvider>
  );
};

// Exports
// ========================================================
export default TonNetworkProvider;

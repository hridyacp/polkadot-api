import { useState, useEffect } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import type { InjectedAccountWithMeta } from '@polkadot/extension-dapp';

const WS_PROVIDER = 'ws://127.0.0.1:9944';
const APP_NAME = 'Decentralized-Notary-dApp';

export const usePolkadot = () => {
  const [api, setApi] = useState<ApiPromise>();
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccountWithMeta>();
  
  useEffect(() => {
    const setup = async () => {
      const wsProvider = new WsProvider(WS_PROVIDER);
      const api = await ApiPromise.create({ provider: wsProvider });
      setApi(api);

      const extensions = await web3Enable(APP_NAME);
      if (extensions.length === 0) {
        console.error('Polkadot{.js} extension not found.');
        return;
      }
      const allAccounts = await web3Accounts();
      setAccounts(allAccounts);

      if (allAccounts.length > 0) {
        setSelectedAccount(allAccounts[0]);
      }
    };

    setup().catch(console.error);
    
    return () => {
        api?.disconnect();
    }

  }, []);

  return { api, accounts, selectedAccount, setSelectedAccount };
};
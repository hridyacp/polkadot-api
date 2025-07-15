import { useState, useEffect } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import type { InjectedAccountWithMeta } from "@polkadot/extension-inject/types"; 

const WS_PROVIDER = 'wss://westend-rpc.polkadot.io';
const APP_NAME = 'Decentralized-Notary-dApp';

export const usePolkadot = () => {
  const [api, setApi] = useState<ApiPromise>();
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccountWithMeta>();

  useEffect(() => {
    const setup = async () => {
      const wsProvider = new WsProvider(WS_PROVIDER);
      wsProvider.on('connected', () => console.log('WebSocket connected to Westend'));
wsProvider.on('error', (err) => console.error('WebSocket error:', err));
wsProvider.on('disconnected', () => console.error('WebSocket disconnected'));
      const api = await ApiPromise.create({ provider: wsProvider });
      setApi(api);
      console.log('Chain:', await api.rpc.system.chain());
      console.log('Genesis Hash:', await api.genesisHash.toHex());
      console.log('Runtime Version:', (await api.rpc.state.getRuntimeVersion()).toHuman());
      const extensions = await web3Enable(APP_NAME);
      if (extensions.length === 0) {
        console.error("Polkadot{.js} extension not found.");
        return;
      }

      const allAccounts = await web3Accounts();
      setAccounts(allAccounts);

      if (allAccounts.length > 0) {
        setSelectedAccount(allAccounts[0]);
      }
    };

    setup();

    // Optional: Cleanup on unmount
    return () => {
      api?.disconnect();
    };
  }, []);

  return { api, accounts, selectedAccount, setSelectedAccount };
};
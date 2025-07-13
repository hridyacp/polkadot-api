// src/App.tsx
import React from 'react';
import { usePolkadot } from '../src/hooks/Polkadot';
import { AccountSelector } from './components/AccountSelector';
import { NotaryForm } from './components/NotaryForm';
import { StatusDisplay } from './components/StatusDisplay';

function App() {
  const { api, accounts, selectedAccount, setSelectedAccount } = usePolkadot();

  return (
    <div style={{ maxWidth: '720px', margin: 'auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Decentralized Notary</h1>
      <p>Anchor a digital fingerprint of your text on the blockchain forever.</p>
      
      <StatusDisplay api={api} accounts={accounts} />

      {api && selectedAccount && (
        <>
          <AccountSelector 
            accounts={accounts}
            selectedAccount={selectedAccount}
            onAccountChange={setSelectedAccount}
          />
          <NotaryForm api={api} selectedAccount={selectedAccount} />
        </>
      )}
    </div>
  );
}

export default App;

import React from 'react';
import './App.css';
import { usePolkadot } from './hooks/Polkadot';
import { AccountSelector } from './components/AccountSelector';
import { SignatureForm } from './components/SignatureForm';
import { StatusDisplay } from './components/StatusDisplay';

function App() {
  const { api, accounts, selectedAccount, setSelectedAccount } = usePolkadot();

  return (
    <div style={{ maxWidth: '720px', width: '100%', padding: '1rem' }}>
      <header className="app-header">
        <h1>PolkaSign</h1>
        <p style={{fontSize:"22px"}}>The Verifiable Signature dApp</p>
      </header>
      
      <StatusDisplay api={api} accounts={accounts} />

      {api && selectedAccount && (
        <>
          <AccountSelector 
            accounts={accounts}
            selectedAccount={selectedAccount}
            // Ensure setSelectedAccount is not undefined before passing
            onAccountChange={(acc) => setSelectedAccount && setSelectedAccount(acc)}
          />
          <SignatureForm api={api} selectedAccount={selectedAccount} />
        </>
      )}
    </div>
  );
}

export default App;

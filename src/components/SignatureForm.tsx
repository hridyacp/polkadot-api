// src/components/SignatureForm.tsx
import React, { useState } from 'react';
import { ApiPromise } from '@polkadot/api';
import { web3FromSource } from '@polkadot/extension-dapp';
import type { InjectedAccountWithMeta } from "@polkadot/extension-inject/types"; 
import * as CryptoJS from 'crypto-js';
import { Spinner } from './Spinner';

interface Props {
  api: ApiPromise;
  selectedAccount: InjectedAccountWithMeta;
}

type SubmissionStatus = 'idle' | 'sending' | 'success' | 'error';

export const SignatureForm: React.FC<Props> = ({ api, selectedAccount }) => {
  const [statementText, setStatementText] = useState('');
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [result, setResult] = useState('');

  const handleSign = async () => {
    if (!statementText) return;

    setStatus('sending');
    setResult('');
    
    // --- KEY CHANGE ---
    // We create a unique, full statement that includes the user's address.
    // This makes the signature personally attributable and verifiable.
    let fullStatement = `Signature by ${selectedAccount.address}: ${statementText}`;
    let statementHash = '0x' + CryptoJS.SHA256(fullStatement).toString(CryptoJS.enc.Hex);

    const injector = await web3FromSource(selectedAccount.meta.source);
    //const tx = api.tx.system.remarkWithEvent(statementHash);
    const tx = api.tx.system.remark(statementHash);
    const now = await api.query.timestamp.now();

    // Retrieve the account balance & nonce via the system module
    const data = await api.query.system.account(selectedAccount.address);
    
    console.log(`${now}: balance of  ${data}`);
  

   
    try {
      await tx.signAndSend(selectedAccount.address, { signer: injector.signer }, ({ status: txStatus }) => {
        if (txStatus.isFinalized) {
          setStatus('success');
          setResult(`✅ Statement signed in block: ${txStatus.asFinalized.toHex()}`);
        }
      });
    } catch (error: any) {
      setStatus('error');
      setResult(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div className="card">
      <div className="form-group">
        <label htmlFor="statement-text">2. Enter the Statement to Sign</label>
        <textarea
          id="statement-text"
          rows={6}
          value={statementText}
          onChange={(e) => setStatementText(e.target.value)}
          placeholder="e.g., I agree to the community code of conduct."
        />
      </div>

      <button
        className="main-button"
        onClick={handleSign}
        disabled={!statementText || status === 'sending'}
      >
        {status === 'sending' ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <Spinner /> Signing...
          </div>
        ) : 'Sign and Broadcast on Polkadot'}
      </button>

      {result && (
        <div className={`result-display ${status}`}>
          <p>
            <strong>Result:</strong> {result}
          </p>
          {status === 'success' && (
            <>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                To verify, another person can re-run this exact statement through a SHA-256 hash and find the resulting transaction on-chain.
              </p>
              <a 
                href={`https://polkadot.js.org/apps/?rpc=${'ws://127.0.0.1:9944'}#/explorer/query/${result.split(': ')[1]}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Signature on Block Explorer
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { ApiPromise } from '@polkadot/api';
import { web3FromSource } from '@polkadot/extension-dapp';
import type { InjectedAccountWithMeta } from '@polkadot/extension-dapp';
import * as CryptoJS from 'crypto-js';
import { TransactionStatus } from './TransactionStatus';

interface Props {
  api: ApiPromise;
  selectedAccount: InjectedAccountWithMeta;
}

export const NotaryForm: React.FC<Props> = ({ api, selectedAccount }) => {
  const [notaryText, setNotaryText] = useState('');
  const [txStatus, setTxStatus] = useState('');
  const [lastTxHash, setLastTxHash] = useState('');

  const handleNotarize = async () => {
    if (!notaryText) {
      alert('Please enter some text to notarize.');
      return;
    }

    setTxStatus('Creating hash...');
    const textHash = '0x' + CryptoJS.SHA256(notaryText).toString(CryptoJS.enc.Hex);

    setTxStatus(`Preparing transaction with hash: ${textHash.slice(0, 18)}...`);
    const injector = await web3FromSource(selectedAccount.meta.source);
    const tx = api.tx.system.remarkWithEvent(textHash);

    setTxStatus('Awaiting signature from extension...');

    try {
      await tx.signAndSend(selectedAccount.address, { signer: injector.signer }, ({ status, events }) => {
        setTxStatus(`Transaction status: ${status.type}`);

        if (status.isFinalized) {
          const finalizedHash = status.asFinalized.toHex();
          const successEvent = events.find(({ event }) => api.events.system.ExtrinsicSuccess.is(event));
          
          if(successEvent){
            setTxStatus(`✅ Success! Finalized in block: ${finalizedHash.slice(0, 18)}...`);
            setLastTxHash(finalizedHash);
          } else {
            const errorEvent = events.find(({ event }) => api.events.system.ExtrinsicFailed.is(event));
            if (errorEvent) {
                const { data: [dispatchError] } = errorEvent.event;
                const decoded = api.registry.findMetaError(dispatchError.asModule);
                const { docs, name, section } = decoded;
                const errorInfo = `${section}.${name}: ${docs.join(' ')}`;
                setTxStatus(`❌ Error: ${errorInfo}`);
            }
          }
        }
      });
    } catch (error) {
      setTxStatus(`Error: ${(error as Error).message}`);
    }
  };

  return (
    <>
      <div style={{ margin: '2rem 0' }}>
        <label htmlFor="notary-text" style={{ display: 'block', marginBottom: '0.5rem' }}>
          <strong>2. Enter Text to Notarize</strong>
        </label>
        <textarea
          id="notary-text"
          rows={5}
          style={{ width: '100%', padding: '0.5rem', display: 'block' }}
          value={notaryText}
          onChange={(e) => setNotaryText(e.target.value)}
          placeholder="Type or paste your agreement, note, or secret message here..."
        />
      </div>

      <button
        style={{ padding: '1rem 2rem', fontSize: '1.2rem', cursor: 'pointer', width: '100%' }}
        onClick={handleNotarize}
        disabled={!notaryText || txStatus.includes('Awaiting')}
      >
        Notarize on Blockchain
      </button>

      {txStatus && <p style={{marginTop: '1rem'}}><i>{txStatus}</i></p>}
      {lastTxHash && <TransactionStatus blockHash={lastTxHash} />}
    </>
  );
};

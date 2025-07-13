import React from 'react';

const WS_PROVIDER = 'ws://127.0.0.1:9944';

interface Props {
  blockHash: string;
}

export const TransactionStatus: React.FC<Props> = ({ blockHash }) => {
  const explorerUrl = `https://polkadot.js.org/apps/?rpc=${WS_PROVIDER}#/explorer/query/${blockHash}`;
  
  return (
    <div style={{ marginTop: '2rem', wordBreak: 'break-all' }}>
      <strong>Last Transaction Finalized in Block:</strong>
      <p>
        <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
          {blockHash}
        </a>
      </p>
      <p>You can click the link to inspect the block on a block explorer!</p>
    </div>
  );
};
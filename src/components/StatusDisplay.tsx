import React from 'react';

interface Props {
  api: any; 
  accounts: any[];
}

export const StatusDisplay: React.FC<Props> = ({ api, accounts }) => {
  let statusText = 'Initializing...';
  if (api && accounts.length === 0) {
    statusText = 'Connected to chain. No accounts found in extension.';
  } else if (api && accounts.length > 0) {
    statusText = 'Ready!';
  } else if (!api) {
    statusText = 'Connecting to chain...';
  }

  return (
    <div style={{ background: '#eee', padding: '1rem', borderRadius: '8px', margin: '1rem 0' }}>
      <strong>Connection Status:</strong> {statusText}
    </div>
  );
};

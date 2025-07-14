import React from 'react';
import { ApiPromise } from '@polkadot/api';
import type { InjectedAccountWithMeta } from '@polkadot/extension-dapp/types';

interface Props {
  api: ApiPromise | undefined;
  accounts: InjectedAccountWithMeta[];
}

export const StatusDisplay: React.FC<Props> = ({ api, accounts }) => {
  let statusText = '';
  let statusClass = 'info';
  let isLoading = false;

  if (!api) {
    statusText = 'Connecting to blockchain...';
    isLoading = true;
  } else if (accounts.length === 0) {
    statusText = 'No accounts found. Please check your Polkadot.js extension.';
    statusClass = 'error';
  } else {
    statusText = 'Connected and ready.';
    statusClass = 'success';
  }

  return (
    <div className={`status-display ${statusClass}`}>
      {isLoading && <div className="spinner"></div>}
      <span>{statusText}</span>
    </div>
  );
};

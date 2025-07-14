import React from 'react';
import type { InjectedAccountWithMeta } from '@polkadot/extension-dapp/types';

interface Props {
  accounts: InjectedAccountWithMeta[];
  selectedAccount: InjectedAccountWithMeta;
  onAccountChange: (account: InjectedAccountWithMeta) => void;
}

export const AccountSelector: React.FC<Props> = ({ accounts, selectedAccount, onAccountChange }) => {
  return (
    <div className="card">
      <div className="form-group">
        <label htmlFor="account-select">1. Select Your Account</label>
        <select
          id="account-select"
          value={selectedAccount.address}
          onChange={(e) => {
            const selected = accounts.find(acc => acc.address === e.target.value);
            if (selected) {
              onAccountChange(selected);
            }
          }}
        >
          {accounts.map((acc) => (
            <option key={acc.address} value={acc.address}>
              {acc.meta.name} ({acc.address.slice(0, 8)}...{acc.address.slice(-8)})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

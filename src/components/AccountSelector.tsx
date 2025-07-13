import React from 'react';
import type { InjectedAccountWithMeta } from '@polkadot/extension-dapp';

interface Props {
  accounts: InjectedAccountWithMeta[];
  selectedAccount: InjectedAccountWithMeta | undefined;
  onAccountChange: (account: InjectedAccountWithMeta) => void;
}

export const AccountSelector: React.FC<Props> = ({ accounts, selectedAccount, onAccountChange }) => {
  if (accounts.length === 0) {
    return <p>No accounts found. Please add one to your Polkadot extension.</p>;
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = accounts[parseInt(e.target.value, 10)];
    onAccountChange(selected);
  };

  return (
    <div style={{ margin: '2rem 0' }}>
      <label htmlFor="account-select" style={{ display: 'block', marginBottom: '0.5rem' }}>
        <strong>1. Select Your Account</strong>
      </label>
      <select
        id="account-select"
        style={{ width: '100%', padding: '0.5rem' }}
        value={accounts.findIndex(acc => acc.address === selectedAccount?.address)}
        onChange={handleSelectChange}
      >
        {accounts.map((acc, index) => (
          <option key={acc.address} value={index}>
            {acc.meta.name} ({acc.address.slice(0, 8)}...)
          </option>
        ))}
      </select>
    </div>
  );
};

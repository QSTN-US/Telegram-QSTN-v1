import React from 'react';

export const CredentialRowDetail = ({ name, value }) => {
  return (
    <div className={'credential-row-detail'}>
      <div className="name">{name}</div>
      <div className="value">{value}</div>
    </div>
  );
};

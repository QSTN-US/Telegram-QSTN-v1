import React from 'react';

import { CredentialRowDetail } from './credential-row-details';

export const OnlyCredentialDetails = (props) => {
  const { credential } = props;

  const subjectData = Object.keys(credential.credentialSubject)
    .filter((key) => !['id', 'type'].includes(key))
    .map((name) => {
      const value = credential.credentialSubject[name];
      return {
        name,
        value
      };
    });

  const commonInfo = [
    {
      name: 'Issued on',
      value: credential.issuanceDate
    },
    {
      name: 'Issuer',
      value: credential.issuer
    },
    {
      name: 'Expiration date',
      value: credential.expirationDate
    },
    {
      name: 'Proof types',
      value: credential.proof.map(({ type }) => type).join(', ')
    }
  ];

  return (
    <div className={'credentials-details-wrapper'}>
      <div className="back-arrow font-bold" onClick={props.onBack}>
        Back
      </div>
      <div className="credential-name">{credential.credentialSubject.type}</div>
      {[...subjectData, ...commonInfo].map((data, index) => {
        return <CredentialRowDetail key={index} {...data} />;
      })}
    </div>
  );
};

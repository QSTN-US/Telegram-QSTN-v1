import dayjs from 'dayjs';
import { useState } from 'react';

import { OnlyCredentialDetails } from './only-credential-details';

const hideString = (input, first = 15, second = -10) => {
  return `${input.slice(0, first)} ... ${input.slice(second)}`;
};

function ellipsisString(description, maxsize) {
  if (!description || description.length < maxsize) {
    return description;
  }
  return `${description.slice(0, maxsize - 3)}...`;
}

export const CredentialDetails = (props) => {
  const { linkedCredentials, credential, name } = props;
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClickDelete = (e) => {
    e.stopPropagation();
    let accounts = JSON.parse(localStorage.getItem('accounts'));
    console.log('acc.did !== credential.id', credential.issuer);
    let updated_accounts = accounts.filter(
      (acc) => acc.did !== credential.issuer
    );
    console.log('updated_accounts', updated_accounts);
    localStorage.setItem('accounts', JSON.stringify(updated_accounts));
    window.dispatchEvent(new Event('storage'));
    props.onDelete(credential.id);
    props.onBack();
  };

  const handleCredentialClick = (credential) => {
    setSelectedCredential(credential);
    console.log(credential);
  };

  const subjectData = Object.keys(credential.credentialSubject)
    .filter((key) => !['id', 'type'].includes(key))
    .map((name) => {
      const value = credential.credentialSubject[name];
      return {
        name,
        value
      };
    });

  const linkedClaims = linkedCredentials.filter((innerCred) =>
    `${innerCred.credentialSubject.type}`.match(/Claim/)
  );
  const _linkedCredentials = linkedCredentials.filter((innerCred) =>
    `${innerCred.credentialSubject.type}`.match(/Credential/)
  );

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

  console.log(_linkedCredentials, linkedClaims);

  if (selectedCredential) {
    return (
      <OnlyCredentialDetails
        credential={selectedCredential}
        onBack={() => setSelectedCredential(null)}
      />
    );
  }

  return (
    <div className={'credentials-details-wrapper'}>
      <div className="back-arrow mb-3 text-sm font-bold" onClick={props.onBack}>
        Back
      </div>

      <div className="card">
        <div className="card-inner">
          <div className="front">
            <div className="row">
              <img
                src="data:image/png;base64,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"
                width="60px"
              />
              <img
                src="https://issuer-demo.polygonid.me/assets/logo.png"
                width="200px"
              />
            </div>
            <div className="row card-no">
              <p>{hideString(credential.issuer)}</p>
            </div>
            <div className="row card-holder">
              <p>ACCOUNT NAME</p>
              <p>ISSUED ON</p>
            </div>
            <div className="row name">
              <p>{credential.name}</p>
              <p>{dayjs(credential.issuanceDate).format('MM/YYYY')}</p>
            </div>
          </div>
          <div className="back">
            <div className="bar">
              <p style={{ marginLeft: '30px', marginRight: '30px' }}>
                {credential.issuer}
              </p>
            </div>
            <div className="row card-cvv">
              <p>{credential.credentialSubject.type}</p>
            </div>
            <div className="row card-text">
              <p>
                this is a virtual card, here we can place more information about
                the credential.
              </p>
            </div>
            <div className="row signature">
              <p>CUSTOMER SIGNATURE</p>
              <img
                src="https://issuer-demo.polygonid.me/assets/logo.png"
                width="120px"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

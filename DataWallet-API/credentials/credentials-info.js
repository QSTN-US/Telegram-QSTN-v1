import { Tab } from '@headlessui/react';
import { classNames } from '@lib/utils';
import { Fragment, useState } from 'react';

import { CredentialDetails } from './credential-details';
import { CredentialRowDetail } from './credential-row-details';
import { CredentialsListItem } from './credentials-list-item';
import { OnlyCredentialDetails } from './only-credential-details';

export const CredentialsInfo = (props) => {
  const [value, setValue] = useState(0);
  const { credentials, credentialsGroups } = props;
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [selectedInner, setSelectedInner] = useState(null);

  const getGroupContents = (credentialsGroups, selectedCredential) => {
    console.log(credentialsGroups, selectedCredential);
    const groupKey = selectedCredential || null;
    return credentialsGroups[groupKey] || [];
  };

  const handleCredentialClick = (credential, inner = false) => {
    setSelectedCredential(credential);
    inner ? setSelectedInner(credential) : setSelectedInner(null);
    console.log(credential);
  };

  if (selectedCredential && selectedInner !== null) {
    return (
      <OnlyCredentialDetails
        credential={selectedCredential}
        onBack={() => setSelectedCredential(null)}
      />
    );
  }

  if (selectedCredential) {
    const innerCredentials = getGroupContents(
      credentialsGroups,
      Object.keys(credentialsGroups).find(
        (key) => key === selectedCredential.issuer
      )
    );

    const subjectData =
      credentials.length &&
      Object.keys(credentials[0]?.credentialSubject)
        .filter((key) => !['id', 'type'].includes(key))
        .map((name) => {
          const value = credentials[0]?.credentialSubject[name];
          return {
            name,
            value
          };
        });

    const credential = credentials[0];

    const linkedClaims = innerCredentials.filter((innerCred) =>
      `${innerCred.credentialSubject.type}`.match(/Claim/)
    );
    const _linkedCredentials = innerCredentials.filter((innerCred) =>
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

    return (
      <div>
        <CredentialDetails
          credential={selectedCredential}
          linkedCredentials={innerCredentials}
          onDelete={props.onDeleteCredential}
          onBack={() => setSelectedCredential(null)}
        />

        <div className="mx-auto mt-3 w-full">
          <Tab.Group as="div">
            <div className="border-b border-gray-200">
              <Tab.List className="-mb-px flex space-x-8">
                <Tab
                  className={({ selected }) =>
                    classNames(
                      selected
                        ? 'border-navy-300 text-navy-300'
                        : 'border-transparent text-gray-700',
                      'focus:none whitespace-nowrap border-b-2 py-2 text-sm font-bold'
                    )
                  }
                >
                  CREDENTIALS
                </Tab>
                <Tab
                  className={({ selected }) =>
                    classNames(
                      selected
                        ? 'border-navy-300 text-navy-300'
                        : 'border-transparent text-gray-700',
                      'focus:none whitespace-nowrap border-b-2 py-2 text-sm font-bold'
                    )
                  }
                >
                  CLAIMS
                </Tab>
                <Tab
                  className={({ selected }) =>
                    classNames(
                      selected
                        ? 'border-navy-300 text-navy-300'
                        : 'border-transparent text-gray-700',
                      'focus:none whitespace-nowrap border-b-2 py-2 text-sm font-bold'
                    )
                  }
                >
                  DETAILS
                </Tab>
              </Tab.List>
            </div>
            <Tab.Panels as={Fragment}>
              <Tab.Panel className="py-3">
                <div className="grid-wallet grid-left text-xs">
                  {_linkedCredentials.map((innerCred, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleCredentialClick(innerCred, true)}
                    >
                      <div className="smallcard">
                        <div className="provider_logo">
                          <img src="data:image/png;base64,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" />
                        </div>
                        <div>
                          {innerCred.expirationDate ? 'T' : 'A'}I
                          {innerCred.credentialSubject.id ? 'C' : 'D'}
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 'bold',
                          marginLeft: '4px',
                          marginTop: '6px'
                        }}
                      >
                        {`${innerCred.credentialSubject.type}`.replace(
                          'Credential',
                          ''
                        )}
                      </span>
                    </div>
                  ))}

                  {_linkedCredentials.length === 0 && (
                    <div style={{ marginTop: '-16px', whiteSpace: 'nowrap' }}>
                      <h4>No Credentials Available</h4>
                    </div>
                  )}
                </div>
              </Tab.Panel>

              <Tab.Panel className="text-xs text-gray-500">
                <div className="grid-wallet grid-left">
                  {linkedClaims.map((innerCred, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleCredentialClick(innerCred, true)}
                    >
                      <div className="smallcard">
                        <div className="provider_logo">
                          <img src="data:image/png;base64,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" />
                        </div>
                        <div>
                          {innerCred.expirationDate ? 'T' : 'A'}C
                          {innerCred.credentialSubject.id ? 'C' : 'D'}
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 'bold',
                          marginLeft: '4px',
                          marginTop: '6px'
                        }}
                      >
                        {`${innerCred.credentialSubject.type}`.replace(
                          'Claim',
                          ''
                        )}
                      </span>
                    </div>
                  ))}

                  {linkedClaims.length === 0 && (
                    <div className="col-span-3 pl-3 pt-6 text-sm font-bold">
                      <h3>No Claims Available</h3>
                    </div>
                  )}
                </div>
              </Tab.Panel>

              <Tab.Panel className="pt-3">
                <div className="credential-name">
                  {credential.credentialSubject.type}
                </div>
                {[...subjectData, ...commonInfo].map((data, index) => {
                  return <CredentialRowDetail key={index} {...data} />;
                })}
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    );
  }

  return (
    <div className={'credentials-info-wrapper'}>
      {credentials.map((credential, index) => {
        console.log(
          'TYPE ==>',
          credential.credentialSubject.type,
          credential.credentialSubject.id
        );
        return (
          <CredentialsListItem
            key={index}
            name={credential.credentialSubject.type}
            issuer={credential.issuer}
            credential={credential}
            onDelete={props.onDeleteCredential}
            onClick={handleCredentialClick}
          />
        );
      })}
    </div>
  );
};

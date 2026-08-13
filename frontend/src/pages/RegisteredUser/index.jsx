import React from 'react';
import RegisteredUserComponent from '../../components/RegisteredUser/index.jsx';

export default function RegisteredUser({ onBack, prefilledUser }) {
  return (
    <div className="page-wrapper registered-user-page">
      <RegisteredUserComponent onBack={onBack} prefilledUser={prefilledUser} />
    </div>
  );
}

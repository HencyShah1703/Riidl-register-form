import React from 'react';
import NewUserComponent from '../../components/NewUser/index.jsx';

export default function NewUser({ onBack }) {
  return (
    <div className="page-wrapper new-user-page">
      <NewUserComponent onBack={onBack} />
    </div>
  );
}

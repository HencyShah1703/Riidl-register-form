import React from 'react';
import RegisterComponent from '../../components/Register/index.jsx';

// Renders the main register user check-in flow container
export default function Register({ currentPage, setCurrentPage, prefilledUser, setPrefilledUser }) {
  return (
    <div className="page-wrapper register-page">
      <RegisterComponent 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        prefilledUser={prefilledUser}
        setPrefilledUser={setPrefilledUser}
      />
    </div>
  );
}

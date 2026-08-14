import React from 'react';
import EmailHeader from './EmailHeader.jsx';
import EmailForm from './EmailForm.jsx';

// Welcomes the admin user and receives their email address to send OTP code
export default function AdminLoginEmail({ emailInput, setEmailInput, isLoading, onSubmit }) {
  return (
    <>
      <EmailHeader />
      <EmailForm 
        emailInput={emailInput} 
        setEmailInput={setEmailInput} 
        isLoading={isLoading} 
        onSubmit={onSubmit} 
      />
    </>
  );
}

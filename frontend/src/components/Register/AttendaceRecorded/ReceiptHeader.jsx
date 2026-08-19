import React from 'react';
import riidlLogo from '../../../assets/riidl_logo.png';

// Renders the success checkmark and welcomes the visitor based on registration type
export default function ReceiptHeader({ record, isNewVisitor }) {
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0.25rem 0 1.25rem 0', width: '100%' }}>
        <img src={riidlLogo} alt="RIIDL Logo" style={{ height: '56px', width: 'auto', objectFit: 'contain', marginBottom: '0.5rem' }} />
        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#1f2937', fontFamily: 'var(--font-title)' }}>Welcome to Riidl</div>
        <div style={{ fontSize: '0.85rem', color: '#4b5563', fontFamily: 'var(--font-body)', marginTop: '0.1rem' }}>A place to build your startup</div>
      </div>

      <div className="success-icon-wrapper">
        <svg className="checkmark-svg" viewBox="0 0 52 52" width="64" height="64">
          <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
          <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
      </div>

      <h2 className="success-title">Your Visit is Recorded!</h2>
      {isNewVisitor ? (
        <p className="success-subtitle">
          Thank you for visiting !! <br />
          We look forward to a productive interaction.
        </p>
      ) : (
        <p className="success-subtitle">
          Welcome back, <strong>{record.name}</strong>!<br />
        </p>
      )}
    </>
  );
}

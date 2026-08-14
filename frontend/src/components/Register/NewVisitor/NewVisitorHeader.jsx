import React from 'react';
import riidlLogo from '../../../assets/riidl_logo.png';

// Renders the header for new visitor registration form
export default function NewVisitorHeader({ onBack, isLoading }) {
  return (
    <div className="form-header-row">
      <button type="button" className="back-link-btn" onClick={onBack} disabled={isLoading}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '0.25rem', display: 'inline-block', verticalAlign: 'middle' }}>
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back
      </button>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0.25rem 0 1.25rem 0' }}>
        <img src={riidlLogo} alt="RIIDL Logo" style={{ height: '56px', width: 'auto', objectFit: 'contain', marginBottom: '0.5rem' }} />
        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#1f2937', fontFamily: 'var(--font-title)' }}>Welcome to Riidl</div>
        <div style={{ fontSize: '0.85rem', color: '#4b5563', fontFamily: 'var(--font-body)', marginTop: '0.1rem' }}>A place to build your startup</div>
      </div>
      <div className="form-title-group">
        <h2>New Visitor</h2>
        <p>Please fill in your details to record your visit.</p>
      </div>
    </div>
  );
}

import React from 'react';

// Renders the check-in submission button with dynamic spinner loading state
export default function VerifySubmitButton({ isLoading }) {
  return (
    <button type="submit" className="btn-primary form-submit-btn" disabled={isLoading}>
      {isLoading ? (
        <>
          <svg className="spinner-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3">
            <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="8" />
          </svg>
          Confirming Check-in...
        </>
      ) : (
        <>
          Confirm Check-in
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: '0.25rem', display: 'inline-block', verticalAlign: 'middle' }}>
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </>
      )}
    </button>
  );
}

import React from 'react';

// Renders the email input field and submit button for Admin access
export default function EmailForm({ emailInput, setEmailInput, isLoading, onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
      <div className="input-group" style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="adminEmail">Email Address</label>
        <div className="input-wrapper">
          <svg className="input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          <input
            id="adminEmail"
            type="email"
            placeholder="hency.shah@somaiya.edu"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.9rem' }} disabled={isLoading}>
        {isLoading ? 'Sending OTP...' : 'Send Verification OTP'}
      </button>
    </form>
  );
}

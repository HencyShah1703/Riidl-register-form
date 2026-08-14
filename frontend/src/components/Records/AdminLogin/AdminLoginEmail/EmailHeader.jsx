import React from 'react';

// Renders the admin authorization lock icon and access restricted header
export default function EmailHeader() {
  return (
    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: '#fee2e2', color: 'var(--danger)', marginBottom: '1rem' }}>
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
      <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Admin Access Only</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Please verify your email address to access visitor database records.</p>
    </div>
  );
}

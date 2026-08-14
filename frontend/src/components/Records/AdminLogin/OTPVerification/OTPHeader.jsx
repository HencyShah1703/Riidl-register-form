import React from 'react';

// Renders the key verification prompt asking for 6-digit OTP code sent to the email
export default function OTPHeader({ email }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: '#eff6ff', color: 'var(--primary)', marginBottom: '1rem' }}>
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      </div>
      <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Enter Verification Code</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
        A 6-digit OTP code has been sent to <strong>{email}</strong>.
      </p>
    </div>
  );
}

import React from 'react';

// Renders the 6-digit OTP code input block, verify action, change email option, and resend triggers
export default function OTPForm({
  otpInput,
  setOtpInput,
  isLoading,
  onSubmit,
  onChangeEmail,
  onResendOtp
}) {
  return (
    <form onSubmit={onSubmit}>
      <div className="input-group" style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="otpCode">One-Time Password (OTP)</label>
        <div className="input-wrapper">
          <svg className="input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <input
            id="otpCode"
            type="text"
            maxLength="6"
            placeholder="Enter 6-digit code"
            value={otpInput}
            onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
            required
            disabled={isLoading}
            style={{
              letterSpacing: otpInput ? '4px' : 'normal',
              textAlign: otpInput ? 'center' : 'left',
              fontSize: otpInput ? '1.25rem' : '0.95rem',
              fontWeight: otpInput ? 'bold' : 'normal'
            }}
          />
        </div>
      </div>

      <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.9rem', marginBottom: '1rem' }} disabled={isLoading}>
        {isLoading ? 'Verifying...' : 'Verify & Open Logs'}
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginTop: '0.5rem' }}>
        <button type="button" className="back-link-btn" onClick={onChangeEmail} disabled={isLoading}>
          Change Email
        </button>
        <button type="button" className="back-link-btn" onClick={onResendOtp} disabled={isLoading} style={{ color: 'var(--primary)' }}>
          Resend OTP Code
        </button>
      </div>
    </form>
  );
}

import React from 'react';
import AdminLoginEmail from './AdminLoginEmail/index.jsx';
import OTPVerification from './OTPVerification/index.jsx';

// Renders the login card wrapper and switches between Email input and OTP input forms
export default function AdminLogin({
  loginStep,
  emailInput,
  setEmailInput,
  otpInput,
  setOtpInput,
  isLoading,
  error,
  infoMessage,
  onSendOtp,
  onVerifyOtp,
  onChangeEmail,
  onResendOtp,
  onGoBack
}) {
  return (
    <div className="page-wrapper records-page" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      {onGoBack && (
        <div style={{ alignSelf: 'flex-start', width: '100%', maxWidth: '420px', margin: '0 auto 1rem auto' }}>
          <button 
            onClick={onGoBack}
            className="btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back
          </button>
        </div>
      )}

      <div className="terminal-card glass-panel animate-fade-in" style={{ maxWidth: '420px', width: '100%', padding: '2.5rem 2rem' }}>
        {error && <div className="error-alert" style={{ marginBottom: '1.25rem' }}>{error}</div>}
        {infoMessage && <div className="secure-info-bar" style={{ marginBottom: '1.25rem', background: '#ecfdf5', color: '#047857', borderColor: '#a7f3d0' }}>{infoMessage}</div>}

        {loginStep === 'email' ? (
          <AdminLoginEmail
            emailInput={emailInput}
            setEmailInput={setEmailInput}
            isLoading={isLoading}
            onSubmit={onSendOtp}
          />
        ) : (
          <OTPVerification
            email={emailInput}
            otpInput={otpInput}
            setOtpInput={setOtpInput}
            isLoading={isLoading}
            onSubmit={onVerifyOtp}
            onChangeEmail={onChangeEmail}
            onResendOtp={onResendOtp}
          />
        )}
      </div>
    </div>
  );
}

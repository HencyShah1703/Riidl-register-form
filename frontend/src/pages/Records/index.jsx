import React, { useState, useEffect } from 'react';
import RecordsComponent from '../../components/Records/index.jsx';

export default function Records() {
  const [adminEmail, setAdminEmail] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [loginStep, setLoginStep] = useState('email'); // 'email' or 'otp'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  useEffect(() => {
    // Check if admin email is already verified in this session
    const savedEmail = sessionStorage.getItem('adminEmail');
    if (savedEmail === 'hency.shah@somaiya.edu') {
      setAdminEmail(savedEmail);
    }
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (emailInput.trim().toLowerCase() !== 'hency.shah@somaiya.edu') {
      setError('Access Denied: You are not authorized to view visitor logs.');
      return;
    }

    setIsLoading(true);
    setError('');
    setInfoMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/visitors/admin/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: emailInput.trim().toLowerCase() })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'failed to send OTP');
      }

      setInfoMessage(data.message);
      setLoginStep('otp');
    } catch (err) {
      if (err.message && err.message.includes('Access Denied')) {
        setError(err.message);
      } else {
        setError('failed to send OTP');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpInput) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/visitors/admin/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: emailInput.trim().toLowerCase(),
          otp: otpInput.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed.');
      }

      sessionStorage.setItem('adminEmail', 'hency.shah@somaiya.edu');
      setAdminEmail('hency.shah@somaiya.edu');
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminEmail');
    setAdminEmail('');
    setEmailInput('');
    setOtpInput('');
    setLoginStep('email');
    setError('');
    setInfoMessage('');
  };

  if (adminEmail === 'hency.shah@somaiya.edu') {
    return (
      <div className="page-wrapper records-page" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem', width: '100%', maxWidth: '1100px', margin: '0 auto 1rem auto' }}>
          <button 
            onClick={handleLogout} 
            className="btn-secondary" 
            style={{ padding: '0.5rem 1.05rem', fontSize: '0.85rem', color: 'var(--danger)', borderColor: 'var(--danger)', background: 'transparent' }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '0.35rem', verticalAlign: 'middle' }}>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Admin Log Out
          </button>
        </div>
        <RecordsComponent adminEmail={adminEmail} />
      </div>
    );
  }

  return (
    <div className="page-wrapper records-page" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div className="terminal-card glass-panel animate-fade-in" style={{ maxWidth: '420px', width: '100%', padding: '2.5rem 2rem' }}>
        
        {loginStep === 'email' ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: '#fee2e2', color: 'var(--danger)', marginBottom: '1rem' }}>
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Admin Access Only</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Please verify your email address to access the visitor log database.</p>
            </div>

            {error && <div className="error-alert" style={{ marginBottom: '1.25rem' }}>{error}</div>}

            <form onSubmit={handleSendOtp}>
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
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      if (error) setError('');
                    }}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.9rem' }} disabled={isLoading}>
                {isLoading ? 'Sending OTP...' : 'Send Verification OTP'}
              </button>
            </form>
          </>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: '#eff6ff', color: 'var(--primary)', marginBottom: '1rem' }}>
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Enter Verification Code</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                A 6-digit OTP code has been sent to <strong>{emailInput}</strong>.
              </p>
            </div>

            {error && <div className="error-alert" style={{ marginBottom: '1.25rem' }}>{error}</div>}
            {infoMessage && <div className="secure-info-bar" style={{ marginBottom: '1.25rem', background: '#ecfdf5', color: '#047857', borderColor: '#a7f3d0' }}>{infoMessage}</div>}

            <form onSubmit={handleVerifyOtp}>
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
                    onChange={(e) => {
                      setOtpInput(e.target.value.replace(/\D/g, '')); // only numbers
                      if (error) setError('');
                    }}
                    required
                    disabled={isLoading}
                    style={{ letterSpacing: otpInput ? '4px' : 'normal', textAlign: otpInput ? 'center' : 'left', fontSize: otpInput ? '1.25rem' : '0.95rem', fontWeight: otpInput ? 'bold' : 'normal' }}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.9rem', marginBottom: '1rem' }} disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify & Open Logs'}
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginTop: '0.5rem' }}>
                <button type="button" className="back-link-btn" onClick={() => { setLoginStep('email'); setError(''); setOtpInput(''); }} disabled={isLoading}>
                  Change Email
                </button>
                <button type="button" className="back-link-btn" onClick={handleSendOtp} disabled={isLoading} style={{ color: 'var(--primary)' }}>
                  Resend OTP Code
                </button>
              </div>
            </form>
          </>
        )}

      </div>
    </div>
  );
}

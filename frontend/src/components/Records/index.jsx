import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin/index.jsx';
import AttendanceLog from './AttendanceLog/index.jsx';
import DetailedAnalytics from './DetailedAnalytics/index.jsx';

// Entry point for records section, switching between login, logs, and analytics
export default function Records({ subPage }) {
  const [adminEmail, setAdminEmail] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [loginStep, setLoginStep] = useState('email'); // 'email' or 'otp'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  // Synchronize auth state on mount and when sessionStorage changes
  useEffect(() => {
    const savedEmail = sessionStorage.getItem('adminEmail');
    if (savedEmail === 'hency.shah@somaiya.edu') {
      setAdminEmail(savedEmail);
    } else {
      setAdminEmail('');
    }
  }, [subPage]);

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

  const goToAnalytics = () => {
    window.history.pushState(null, '', '/analytics');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  if (subPage === 'analytics') {
    return <DetailedAnalytics />;
  }

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
        <AttendanceLog adminEmail={adminEmail} onGoToAnalytics={goToAnalytics} />
      </div>
    );
  }

  return (
    <AdminLogin
      loginStep={loginStep}
      emailInput={emailInput}
      setEmailInput={setEmailInput}
      otpInput={otpInput}
      setOtpInput={setOtpInput}
      isLoading={isLoading}
      error={error}
      infoMessage={infoMessage}
      onSendOtp={handleSendOtp}
      onVerifyOtp={handleVerifyOtp}
      onChangeEmail={() => { setLoginStep('email'); setError(''); setOtpInput(''); }}
      onResendOtp={handleSendOtp}
    />
  );
}

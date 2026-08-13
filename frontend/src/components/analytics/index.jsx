import React, { useState, useEffect } from 'react';
import AnalyticsHeader from './AnalyticsHeader.jsx';
import AnalyticsFilters from './AnalyticsFilters.jsx';
import AnalyticsKPICards from './AnalyticsKPICards.jsx';
import NewUsersTrend from './NewUsersTrend.jsx';
import TodayVisitorsChart from './TodayVisitorsChart.jsx';
import PurposeChart from './PurposeChart.jsx';
import CollegeChart from './CollegeChart.jsx';
import VisitorTypeChart from './VisitorTypeChart.jsx';
import SummaryTable from './SummaryTable.jsx';
import QuickInsights from './QuickInsights.jsx';
import { fetchDashboardData } from '../../services/analyticsApi.js';
import { getPeriodDateRange } from '../../utils/analyticsDates.js';

export default function AnalyticsComponent() {
  // 1. Admin verification states (reused session admin check)
  const [adminEmail, setAdminEmail] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [loginStep, setLoginStep] = useState('email'); // 'email' or 'otp'
  const [isVerifying, setIsVerifying] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  // 2. Analytics filter states
  const [period, setPeriod] = useState('week'); // 'week', 'month', 'year', 'custom'
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [location, setLocation] = useState(''); // empty = all

  // 3. Analytics data states
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [dataError, setDataError] = useState('');

  // Synchronize admin email check on mount
  useEffect(() => {
    const savedEmail = sessionStorage.getItem('adminEmail');
    if (savedEmail === 'hency.shah@somaiya.edu') {
      setAdminEmail(savedEmail);
    }
  }, []);

  // Fetch dashboard data when parameters change
  const loadDashboard = async () => {
    if (!adminEmail) return;

    setIsLoadingData(true);
    setDataError('');

    try {
      let fromStr = '';
      let toStr = '';

      if (period === 'custom') {
        fromStr = customFrom;
        toStr = customTo;
      } else {
        const range = getPeriodDateRange(period);
        fromStr = range.from;
        toStr = range.to;
      }

      const data = await fetchDashboardData(adminEmail, {
        from: fromStr,
        to: toStr,
        location
      });

      setDashboardData(data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setDataError(err.message || 'Failed to retrieve analytics data.');
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (adminEmail) {
      if (period !== 'custom' || (customFrom && customTo)) {
        loadDashboard();
      }
    }
  }, [adminEmail, period, customFrom, customTo, location]);

  // Auth Handlers (identical to Records)
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (emailInput.trim().toLowerCase() !== 'hency.shah@somaiya.edu') {
      setLoginError('Access Denied: You are not authorized to view visitor analytics.');
      return;
    }

    setIsVerifying(true);
    setLoginError('');
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
        setLoginError(err.message);
      } else {
        setLoginError('failed to send OTP');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpInput) return;

    setIsVerifying(true);
    setLoginError('');

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
      setLoginError('');
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminEmail');
    setAdminEmail('');
    setEmailInput('');
    setOtpInput('');
    setLoginStep('email');
    setLoginError('');
    setInfoMessage('');
    setDashboardData(null);
  };

  const handleGoBack = () => {
    window.history.pushState(null, '', '/records');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const getPeriodLabel = () => {
    if (period === 'week') return 'This Week (Last 7 Days)';
    if (period === 'month') return 'This Month (Last 30 Days)';
    if (period === 'year') return 'This Year (Last 365 Days)';
    if (period === 'custom') {
      return customFrom && customTo ? `${customFrom} to ${customTo}` : 'Custom Date Range';
    }
    return '';
  };

  const getLocationLabel = () => {
    return location || 'All Locations';
  };

  // Render Login Form
  if (adminEmail !== 'hency.shah@somaiya.edu') {
    return (
      <div className="page-wrapper records-page" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        
        {/* Simple Exit Button on Login Page too */}
        <div style={{ alignSelf: 'flex-start', width: '100%', maxWidth: '420px', margin: '0 auto 1rem auto' }}>
          <button 
            onClick={handleGoBack}
            className="btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Records
          </button>
        </div>

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
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Please verify your email address to access visitor analytics.</p>
              </div>

              {loginError && <div className="error-alert" style={{ marginBottom: '1.25rem' }}>{loginError}</div>}

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
                        if (loginError) setLoginError('');
                      }}
                      required
                      disabled={isVerifying}
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.9rem' }} disabled={isVerifying}>
                  {isVerifying ? 'Sending OTP...' : 'Send Verification OTP'}
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

              {loginError && <div className="error-alert" style={{ marginBottom: '1.25rem' }}>{loginError}</div>}
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
                        setOtpInput(e.target.value.replace(/\D/g, ''));
                        if (loginError) setLoginError('');
                      }}
                      required
                      disabled={isVerifying}
                      style={{ letterSpacing: otpInput ? '4px' : 'normal', textAlign: otpInput ? 'center' : 'left', fontSize: otpInput ? '1.25rem' : '0.95rem', fontWeight: otpInput ? 'bold' : 'normal' }}
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.9rem', marginBottom: '1rem' }} disabled={isVerifying}>
                  {isVerifying ? 'Verifying...' : 'Verify & Open Analytics'}
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginTop: '0.5rem' }}>
                  <button type="button" className="back-link-btn" onClick={() => { setLoginStep('email'); setLoginError(''); setOtpInput(''); }} disabled={isVerifying}>
                    Change Email
                  </button>
                  <button type="button" className="back-link-btn" onClick={handleSendOtp} disabled={isVerifying} style={{ color: 'var(--primary)' }}>
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

  return (
    <div className="page-wrapper" style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', padding: '1rem 0' }}>
      
      {/* Top Header Row with Back button and Logout */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', width: '100%' }}>
        <button 
          onClick={handleGoBack}
          className="btn-secondary back-btn"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.88rem' }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Records
        </button>

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

      <AnalyticsHeader 
        periodLabel={getPeriodLabel()} 
        locationLabel={getLocationLabel()} 
        onRefresh={loadDashboard}
        isRefreshing={isLoadingData}
        dashboardData={dashboardData}
      />

      <AnalyticsFilters 
        period={period}
        setPeriod={setPeriod}
        customFrom={customFrom}
        setCustomFrom={setCustomFrom}
        customTo={customTo}
        setCustomTo={setCustomTo}
        location={location}
        setLocation={setLocation}
      />

      {dataError && (
        <div className="error-alert" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{dataError}</span>
          <button 
            type="button" 
            onClick={loadDashboard} 
            className="btn-secondary" 
            style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', background: '#ffffff', color: '#b91c1c', border: '1px solid #fca5a5' }}
          >
            Retry
          </button>
        </div>
      )}

      {isLoadingData && (
        <div className="dashboard-loading-card glass-panel" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
          <svg className="spinner-icon" viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#A20202" strokeWidth="3">
            <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="8" />
          </svg>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Loading analytics dashboard data...</p>
        </div>
      )}

      {!isLoadingData && dashboardData && (
        <div id="analytics-report-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem 0' }}>
          <AnalyticsKPICards overview={dashboardData.overview} />
          <QuickInsights insights={dashboardData.insights} />

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <NewUsersTrend data={dashboardData.newUsersTrend} />
            <TodayVisitorsChart todayData={dashboardData.today} />
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <PurposeChart data={dashboardData.purpose} />
            <CollegeChart data={dashboardData.colleges} />
            <VisitorTypeChart data={dashboardData.visitorTypes} />
          </div>

          <SummaryTable summary={dashboardData.summary} />
        </div>
      )}

      {period === 'custom' && (!customFrom || !customTo) && !isLoadingData && (
        <div className="empty-records-card glass-panel" style={{ minHeight: '300px' }}>
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
          </svg>
          <h3>Please Select a Custom Date Range</h3>
          <p>Choose standard dates in the controls above to load detailed analytics.</p>
        </div>
      )}

    </div>
  );
}

import React from 'react';
import riidlLogo from '../../assets/riidl_logo.png';

export default function SuccessReceipt({ record, onReset }) {
  const formatTime = (timeString) => {
    if (!timeString) return 'Just now';
    const date = new Date(timeString);
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const dateOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    return `${date.toLocaleTimeString('en-US', timeOptions)}, ${date.toLocaleDateString('en-US', dateOptions)}`;
  };

  return (
    <div className="success-receipt animate-fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0.25rem 0 1.25rem 0', width: '100%' }}>
        <img src={riidlLogo} alt="RIIDL Logo" style={{ height: '56px', width: 'auto', objectFit: 'contain', marginBottom: '0.5rem' }} />
        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#1f2937', fontFamily: 'var(--font-title)' }}>Welcome to Riidl</div>
        <div style={{ fontSize: '0.85rem', color: '#4b5563', fontFamily: 'var(--font-body)', marginTop: '0.1rem' }}>A place to build your startup</div>
      </div>

      <div className="success-icon-wrapper">
        <svg className="checkmark-svg" viewBox="0 0 52 52" width="64" height="64">
          <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
          <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
      </div>

      <h2 className="success-title">Attendance Recorded!</h2>
      <p className="success-subtitle">
        Welcome back, <strong>{record.name}</strong>!<br />
        Your visit has been recorded successfully.
      </p>

      <div className="receipt-details">
        <h4 className="details-header">Visit Details</h4>
        
        <div className="detail-row">
          <span className="detail-label">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Name
          </span>
          <span className="detail-value">{record.name}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
            </svg>
            College
          </span>
          <span className="detail-value">{record.collegeName}</span>
        </div>

        {record.iAm && (
          <div className="detail-row">
            <span className="detail-label">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              I am
            </span>
            <span className="detail-value">{record.iAm}</span>
          </div>
        )}

        <div className="detail-row">
          <span className="detail-label">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            Purpose
          </span>
          <span className="detail-value">{record.purposeOfVisit}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Time
          </span>
          <span className="detail-value">{formatTime(record.timestamp)}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Location
          </span>
          <span className="detail-value">{record.location}</span>
        </div>
      </div>

      <button type="button" className="btn-primary reset-btn" onClick={onReset}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '0.25rem', display: 'inline-block', verticalAlign: 'middle' }}>
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l.73-2.19" />
        </svg>
        New Entry
      </button>
    </div>
  );
}

import React, { useState } from 'react';
import riidlLogo from '../../assets/riidl_logo.png';

export default function MainPg({ onSelectFlow, onUserFound }) {
  const [countryCode, setCountryCode] = useState('91');
  const [localNumber, setLocalNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    const cleanCC = countryCode.trim().replace(/\D/g, '');
    const cleanLN = localNumber.trim().replace(/\D/g, '');
    const combinedPhone = `+${cleanCC}${cleanLN}`;
    if (!cleanLN) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/visitors/search?phone=${encodeURIComponent(combinedPhone)}`);
      const data = await response.json();

      if (response.status === 404) {
        throw new Error('This number is not registered. Please register as a New Visitor below.');
      } else if (!response.ok) {
        throw new Error(data.message || 'Error occurred while retrieving details');
      }

      onUserFound(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="terminal-card glass-panel animate-fade-in">
      <div className="header-logo-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
        <img src={riidlLogo} alt="RIIDL Logo" style={{ height: '70px', width: 'auto', objectFit: 'contain', marginBottom: '0.75rem' }} />
        <div style={{ fontWeight: 'bold', fontSize: '1.35rem', color: '#1f2937', fontFamily: 'var(--font-title)' }}>Welcome to Riidl</div>
        <div style={{ fontSize: '0.95rem', color: '#4b5563', fontFamily: 'var(--font-body)' }}>A place to build your startup</div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: '500' }}>
          Enter your registered mobile number to fetch your details.
        </p>
      </div>

      {error && <div className="error-alert">{error}</div>}

      <form onSubmit={handleSearch} style={{ width: '100%' }}>
        <div className="input-group" style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="phoneNumber">Phone Number <span className="required">*</span></label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div className="input-wrapper" style={{ width: '85px', flexShrink: 0, position: 'relative' }}>
              <span style={{ position: 'absolute', left: '0.75rem', fontSize: '0.95rem', color: 'var(--text-primary)', pointerEvents: 'none', userSelect: 'none', fontWeight: 'bold' }}>+</span>
              <input
                id="countryCode"
                type="text"
                placeholder="91"
                value={countryCode}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setCountryCode(val);
                  if (error) setError(null);
                }}
                style={{ paddingLeft: '1.5rem', paddingRight: '0.5rem', textAlign: 'center' }}
                required
                disabled={isLoading}
              />
            </div>
            <div className="input-wrapper" style={{ flexGrow: 1 }}>
              <svg className="input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <input
                id="phoneNumber"
                type="tel"
                placeholder=""
                value={localNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setLocalNumber(val);
                  if (error) setError(null);
                }}
                required
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={isLoading} style={{ width: '100%', marginBottom: '1.25rem', padding: '0.95rem' }}>
          {isLoading ? (
            <>
              <svg className="spinner-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3">
                <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="8" />
              </svg>
              Searching...
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Find My Details
            </>
          )}
        </button>
      </form>

      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', textAlign: 'center', width: '100%' }}>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
          Visiting Riidl for the first time?
        </p>
        <button 
          type="button" 
          className="btn-secondary" 
          style={{ width: '100%', padding: '0.85rem' }} 
          onClick={() => onSelectFlow('new')}
        >
          New Visitor
        </button>
      </div>
    </div>
  );
}

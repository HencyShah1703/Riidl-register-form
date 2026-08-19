import React from 'react';

// Renders the phone number lookup form with country code and local phone input
export default function SearchForm({
  localNumber,
  setLocalNumber,
  isLoading,
  onSubmit,
  onClearError
}) {
  return (
    <form onSubmit={onSubmit} style={{ width: '100%' }}>
      <div className="input-group" style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="phoneNumber">Phone Number <span className="required">*</span></label>
        <div className="input-wrapper">
          <svg className="input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <input
            id="phoneNumber"
            type="tel"
            placeholder="Enter 10-digit mobile number"
            maxLength="10"
            value={localNumber}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 10);
              setLocalNumber(val);
              onClearError();
            }}
            required
            disabled={isLoading}
          />
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
  );
}

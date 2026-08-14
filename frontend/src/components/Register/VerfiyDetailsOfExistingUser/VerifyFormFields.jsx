import React from 'react';
import { CollegeSelector, IAmSelector } from '../Selectors/index.jsx';
import { parsePhoneNumber } from '../../../utils/phone.js';

const STANDARD_PURPOSES = [
  'To Meet Someone',
  'For Program/Event',
  'For Training / Workshop / Research',
  'For Facility Tour',
  'For Research Meetup',
  'For using the instrument'
];

// Renders the registration form inputs for returning users
export default function VerifyFormFields({
  formData,
  onChange,
  isLoading,
  isOtherPurpose,
  setIsOtherPurpose,
  customPurpose,
  setCustomPurpose
}) {
  const parsedPhone = parsePhoneNumber(formData.phoneNumber);
  const displayCountryCode = parsedPhone.countryCode.replace('+', '');
  const displayLocalNumber = parsedPhone.localNumber.replace(/\D/g, '');

  return (
    <>
      {/* Name */}
      <div className="input-group">
        <label htmlFor="name">Name <span className="required">*</span></label>
        <div className="input-wrapper prefilled-highlight">
          <svg className="input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your name"
            value={formData.name || ''}
            onChange={onChange}
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Email */}
      <div className="input-group">
        <label htmlFor="email">Email <span className="required">*</span></label>
        <div className="input-wrapper prefilled-highlight">
          <svg className="input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email || ''}
            onChange={onChange}
            required
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Phone Number (Locked/Disabled) */}
      <div className="input-group">
        <label htmlFor="phoneNumber">Phone Number (Registered)</label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <div className="input-wrapper disabled" style={{ width: '85px', flexShrink: 0, position: 'relative' }}>
            <span style={{ position: 'absolute', left: '0.75rem', fontSize: '0.95rem', color: 'var(--text-secondary)', pointerEvents: 'none', userSelect: 'none', fontWeight: 'bold' }}>+</span>
            <input
              id="countryCode"
              type="text"
              value={displayCountryCode}
              disabled
              style={{ paddingLeft: '1.5rem', paddingRight: '0.5rem', textAlign: 'center', cursor: 'not-allowed', color: 'var(--text-secondary)' }}
            />
          </div>
          <div className="input-wrapper disabled" style={{ flexGrow: 1 }}>
            <svg className="input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <input
              id="phoneNumber"
              type="tel"
              value={displayLocalNumber}
              disabled
              style={{ cursor: 'not-allowed', color: 'var(--text-secondary)' }}
            />
          </div>
        </div>
      </div>

      {/* College (Prefilled with selector highlight option) */}
      <div className="input-group">
        <label htmlFor="collegeName">College Name <span className="required">*</span></label>
        <CollegeSelector
          value={formData.collegeName || ''}
          onChange={onChange}
          disabled={isLoading}
          isPrefilled={true}
        />
      </div>

      {/* I am (Prefilled with selector highlight option) */}
      <div className="input-group">
        <label htmlFor="iAm">I am <span className="required">*</span></label>
        <IAmSelector
          value={formData.iAm || ''}
          onChange={onChange}
          disabled={isLoading}
          isPrefilled={true}
        />
      </div>

      {/* Purpose of Visit */}
      <div className="input-group">
        <label htmlFor="purposeOfVisit">Purpose of Visit <span className="required">*</span></label>
        <div className="input-wrapper">
          <svg className="input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          <select
            id="purposeOfVisit"
            name="purposeOfVisit"
            value={isOtherPurpose ? 'Other' : (formData.purposeOfVisit || '')}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'Other') {
                setIsOtherPurpose(true);
                onChange({ target: { name: 'purposeOfVisit', value: customPurpose || '' } });
              } else {
                setIsOtherPurpose(false);
                onChange({ target: { name: 'purposeOfVisit', value: val } });
              }
            }}
            required
            disabled={isLoading}
          >
            <option value="" disabled>Select / enter purpose</option>
            {STANDARD_PURPOSES.map((p, idx) => (
              <option key={idx} value={p}>{p}</option>
            ))}
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Custom Purpose input */}
      {isOtherPurpose && (
        <div className="input-group animate-fade-in" style={{ marginTop: '0.5rem' }}>
          <label htmlFor="customPurpose">Specify Purpose <span className="required">*</span></label>
          <div className="input-wrapper">
            <svg className="input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <input
              id="customPurpose"
              type="text"
              placeholder="Enter your purpose of visit"
              value={customPurpose}
              onChange={(e) => {
                const val = e.target.value;
                setCustomPurpose(val);
                onChange({ target: { name: 'purposeOfVisit', value: val } });
              }}
              required
              disabled={isLoading}
            />
          </div>
        </div>
      )}

      {/* Location */}
      <div className="input-group">
        <label htmlFor="location">Location <span className="required">*</span></label>
        <div className="input-wrapper">
          <svg className="input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <select
            id="location"
            name="location"
            value={formData.location || 'Riidl HQ'}
            onChange={onChange}
            required
            disabled={isLoading}
          >
            <option value="Riidl HQ">Riidl HQ</option>
          </select>
        </div>
      </div>
    </>
  );
}

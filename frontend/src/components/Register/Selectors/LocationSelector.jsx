import React from 'react';

// Renders the Location dropdown selector with Riidl HQ and Bioriidl HQ options
export default function LocationSelector({ value, onChange, disabled, isPrefilled }) {
  return (
    <div className={`input-wrapper ${isPrefilled ? 'prefilled-highlight' : ''} ${disabled ? 'disabled' : ''}`}>
      <svg className="input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
      <select
        id="location"
        name="location"
        value={value || ''}
        onChange={onChange}
        required
        disabled={disabled}
      >
        <option value="" disabled>Select Location</option>
        <option value="Riidl HQ">Riidl HQ</option>
        <option value="Bioriidl HQ">Bioriidl HQ</option>
      </select>
      <svg 
        className="select-chevron" 
        viewBox="0 0 24 24" 
        width="16" 
        height="16" 
        fill="none" 
        stroke="#9ca3af" 
        strokeWidth="2.5"
        style={{ pointerEvents: 'none' }}
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}

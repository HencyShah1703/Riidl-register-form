import React from 'react';

export default function LocationBar() {
  return (
    <div className="location-bar">
      <svg className="location-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
      <span className="location-text">
        Location: <strong>RIIDL HQ</strong> <span className="location-tag">(Default)</span>
      </span>
    </div>
  );
}

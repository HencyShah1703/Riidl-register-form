import React from 'react';

// Renders the button that allows returning to the welcome screen for a new visitor check-in
export default function NewEntryButton({ onReset }) {
  return (
    <button type="button" className="btn-primary reset-btn" onClick={onReset}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '0.25rem', display: 'inline-block', verticalAlign: 'middle' }}>
        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l.73-2.19" />
      </svg>
      New Entry
    </button>
  );
}

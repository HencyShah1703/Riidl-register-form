import React from 'react';

export default function OptionCard({ title, subtitle, type, onClick }) {
  const isNew = type === 'new';
  
  return (
    <div className="option-card" onClick={onClick}>
      <div className={`option-icon-wrapper ${type}`}>
        {isNew ? (
          // Person with "+" icon
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="17" y1="11" x2="23" y2="11" />
          </svg>
        ) : (
          // Person with loop history icon
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l.73-2.19" />
          </svg>
        )}
      </div>
      
      <div className="option-details">
        <h3 className="option-title">{title}</h3>
        <p className="option-subtitle">{subtitle}</p>
      </div>
      
      <div className="option-arrow">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </div>
  );
}

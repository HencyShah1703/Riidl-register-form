import React from 'react';

// Renders the header for attendance records log including Detailed Analytics toggle and Refresh buttons
export default function LogHeader({ onGoToAnalytics, onRefresh, isLoading }) {
  return (
    <div className="dashboard-header">
      <div>
        <h2>Logs</h2>
        <p>Real-time list of visitors and check-ins</p>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <button 
          onClick={onGoToAnalytics}
          className="btn-secondary refresh-btn"
          style={{ display: 'inline-flex', alignItems: 'center', height: '42px', padding: '0 1.25rem', fontSize: '0.88rem' }}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '0.4rem', verticalAlign: 'middle', display: 'inline-block' }}>
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          Detailed Analytics
        </button>

        <button 
          onClick={onRefresh} 
          disabled={isLoading}
          className="btn-secondary refresh-btn"
          style={{ display: 'inline-flex', alignItems: 'center', height: '42px', padding: '0 1.25rem' }}
        >
          <svg 
            className={`spinner-icon ${isLoading ? '' : 'paused'}`} 
            viewBox="0 0 24 24" 
            width="18" 
            height="18" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5"
            style={{ marginRight: '0.35rem', verticalAlign: 'middle', display: 'inline-block' }}
          >
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l.73-2.19" />
          </svg>
          Refresh Log
        </button>
      </div>
    </div>
  );
}

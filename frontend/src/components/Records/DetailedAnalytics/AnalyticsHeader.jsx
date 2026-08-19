import React, { useState } from 'react';
import ExportMenu from './ExportMenu.jsx';

export default function AnalyticsHeader({ periodLabel, locationLabel, onRefresh, isRefreshing, dashboardData }) {
  return (
    <div className="dashboard-header" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
      <div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.025em' }}>Insights</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Detailed visitor registration demographics and check-in analysis for <strong>{locationLabel}</strong>.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <button 
          onClick={onRefresh} 
          disabled={isRefreshing}
          className="btn-secondary refresh-btn"
          style={{ display: 'inline-flex', alignItems: 'center', height: '42px', padding: '0 1.25rem' }}
        >
          <svg 
            className={`spinner-icon ${isRefreshing ? '' : 'paused'}`} 
            viewBox="0 0 24 24" 
            width="18" 
            height="18" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5"
            style={{ marginRight: '0.4rem', verticalAlign: 'middle', display: 'inline-block' }}
          >
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l.73-2.19" />
          </svg>
          {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>

        <ExportMenu 
          dashboardData={dashboardData} 
          periodLabel={periodLabel} 
          locationLabel={locationLabel} 
        />
      </div>
    </div>
  );
}

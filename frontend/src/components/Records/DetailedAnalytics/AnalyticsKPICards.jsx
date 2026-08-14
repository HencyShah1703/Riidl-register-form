import React from 'react';

export default function AnalyticsKPICards({ overview }) {
  const { totalNewUsers, totalVisits, visitorsToday, newVisitorsToday, returningVisitorsToday } = overview;

  return (
    <div className="records-header-grid" style={{ marginBottom: '2rem' }}>
      
      {/* Total New Visitors (Period) */}
      <div className="stat-card glass-panel" style={{ padding: '1.25rem 1.5rem' }}>
        <div className="stat-icon-wrapper purple" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="17" y1="11" x2="23" y2="11" />
          </svg>
        </div>
        <div className="stat-details">
          <span className="stat-label">Total New Visitors</span>
          <h3 className="stat-value" style={{ fontSize: '1.65rem' }}>{totalNewUsers}</h3>
        </div>
      </div>

      {/* Total Visits (Period) */}
      <div className="stat-card glass-panel" style={{ padding: '1.25rem 1.5rem' }}>
        <div className="stat-icon-wrapper blue" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div className="stat-details">
          <span className="stat-label">Total Visits</span>
          <h3 className="stat-value" style={{ fontSize: '1.65rem' }}>{totalVisits}</h3>
        </div>
      </div>

      {/* Visitors Today */}
      <div className="stat-card glass-panel" style={{ padding: '1.25rem 1.5rem' }}>
        <div className="stat-icon-wrapper green" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>
        <div className="stat-details">
          <span className="stat-label">Visitors Today</span>
          <h3 className="stat-value" style={{ fontSize: '1.65rem' }}>{visitorsToday}</h3>
        </div>
      </div>

      {/* New Visitors Today */}
      <div className="stat-card glass-panel" style={{ padding: '1.25rem 1.5rem' }}>
        <div className="stat-icon-wrapper amber" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="17" y1="11" x2="23" y2="11" />
          </svg>
        </div>
        <div className="stat-details">
          <span className="stat-label">New Visitors Today</span>
          <h3 className="stat-value" style={{ fontSize: '1.65rem' }}>{newVisitorsToday}</h3>
        </div>
      </div>

      {/* Already Registered Visitors Today */}
      <div className="stat-card glass-panel" style={{ padding: '1.25rem 1.5rem' }}>
        <div className="stat-icon-wrapper red" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l.73-2.19" />
          </svg>
        </div>
        <div className="stat-details">
          <span className="stat-label">Already Registered Today</span>
          <h3 className="stat-value" style={{ fontSize: '1.65rem' }}>{returningVisitorsToday}</h3>
        </div>
      </div>

    </div>
  );
}

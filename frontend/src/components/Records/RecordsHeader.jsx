import React from 'react';

export default function RecordsHeader({ records }) {
  const totalCount = records.length;
  
  // Calculate today's count
  const todayCount = records.filter(r => {
    const today = new Date();
    const recordDate = new Date(r.timestamp);
    return today.toDateString() === recordDate.toDateString();
  }).length;

  // Calculate unique visitors
  const uniquePhones = new Set(records.map(r => r.phoneNumber));
  const uniqueCount = uniquePhones.size;

  return (
    <div className="records-header-grid">
      <div className="stat-card glass-panel">
        <div className="stat-icon-wrapper blue">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div className="stat-details">
          <span className="stat-label">Total Visits</span>
          <h3 className="stat-value">{totalCount}</h3>
        </div>
      </div>

      <div className="stat-card glass-panel">
        <div className="stat-icon-wrapper green">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>
        <div className="stat-details">
          <span className="stat-label">Check-ins Today</span>
          <h3 className="stat-value">{todayCount}</h3>
        </div>
      </div>

      <div className="stat-card glass-panel">
        <div className="stat-icon-wrapper purple">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="17" y1="11" x2="23" y2="11" />
          </svg>
        </div>
        <div className="stat-details">
          <span className="stat-label">Unique Registered</span>
          <h3 className="stat-value">{uniqueCount}</h3>
        </div>
      </div>
    </div>
  );
}

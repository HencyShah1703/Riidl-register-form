import React from 'react';

export default function AnalyticsHeader() {
  return (
    <div className="dashboard-header" style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.025em', margin: 0, color: 'var(--text-primary)' }}>Insights</h2>
    </div>
  );
}

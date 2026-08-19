import React from 'react';

export default function AnalyticsKPICards({ overview }) {
  const { 
    totalNewUsers = 0, 
    totalVisits = 0, 
    totalUniqueVisitors = 0, 
    totalReturningUsers = 0 
  } = overview || {};

  const calculatedTotalVisitors = totalUniqueVisitors || (totalNewUsers + totalReturningUsers);

  const kpis = [
    {
      id: 'total-visitors',
      label: 'Total Visitors',
      value: calculatedTotalVisitors
    },
    {
      id: 'new-visitors',
      label: 'Total New Visitors',
      value: totalNewUsers
    },
    {
      id: 'total-visits',
      label: 'Total Visits',
      value: totalVisits
    }
  ];

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
      {kpis.map((kpi) => (
        <div 
          key={kpi.id} 
          style={{ 
            background: '#ffffff', 
            border: '1px solid #000000', 
            borderRadius: '6px', 
            padding: '0.25rem 0.6rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          <span>{kpi.label}</span>
          <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{kpi.value}</span>
        </div>
      ))}
    </div>
  );
}

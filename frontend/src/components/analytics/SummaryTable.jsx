import React from 'react';

export default function SummaryTable({ summary }) {
  if (!summary) return null;

  const rows = [
    { key: 'week', label: 'This Week (Last 7 Days)', data: summary.week },
    { key: 'month', label: 'This Month (Last 30 Days)', data: summary.month },
    { key: 'year', label: 'This Year (Last 365 Days)', data: summary.year }
  ];

  if (summary.custom) {
    rows.push({ key: 'custom', label: 'Selected Custom Period', data: summary.custom, highlight: true });
  }

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      <h4 style={{ margin: '0 0 1.25rem 0', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
        Period Performance Summary
      </h4>
      
      <div className="table-responsive" style={{ overflowX: 'auto' }}>
        <table className="records-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '0.75rem 1rem' }}>Time Period</th>
              <th style={{ textAlign: 'center', padding: '0.75rem 1rem' }}>New Users (First-time)</th>
              <th style={{ textAlign: 'center', padding: '0.75rem 1rem' }}>Total Visits (Check-ins)</th>
              <th style={{ textAlign: 'center', padding: '0.75rem 1rem' }}>Unique Visitors</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr 
                key={row.key} 
                className={row.highlight ? 'today-row' : ''}
                style={{ 
                  background: row.highlight ? 'rgba(162, 2, 2, 0.04)' : 'transparent',
                  fontWeight: row.highlight ? 'bold' : 'normal',
                  borderLeft: row.highlight ? '4px solid var(--primary)' : 'none'
                }}
              >
                <td style={{ padding: '0.9rem 1rem', textAlign: 'left', color: 'var(--text-primary)' }}>
                  {row.label}
                </td>
                <td style={{ padding: '0.9rem 1rem', textAlign: 'center' }}>
                  <span style={{ 
                    background: '#f3f4f6', 
                    padding: '0.2rem 0.5rem', 
                    borderRadius: '6px', 
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)'
                  }}>
                    {row.data?.newUsers ?? 0}
                  </span>
                </td>
                <td style={{ padding: '0.9rem 1rem', textAlign: 'center', color: 'var(--text-primary)' }}>
                  {row.data?.totalVisits ?? 0}
                </td>
                <td style={{ padding: '0.9rem 1rem', textAlign: 'center', color: 'var(--text-primary)' }}>
                  {row.data?.visitors ?? 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

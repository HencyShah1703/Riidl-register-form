import React from 'react';

export default function InternshipVisitorsChart({ stats, chartData }) {
  const { total = 0, unique = 0, returning = 0 } = stats || {};
  const hasData = chartData && chartData.length > 0;

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: '1 1 100%', width: '100%' }}>
      <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
        Internship Visitors & Mentors
      </h4>

      {/* Mini KPI Cards row */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ flex: 1, padding: '0.75rem', background: 'var(--success-bg)', borderRadius: '12px', border: '1px solid #fecaca', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Internship Visits</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.25rem' }}>{total}</div>
        </div>
        <div style={{ flex: 1, padding: '0.75rem', background: '#eff6ff', borderRadius: '12px', border: '1px solid #bfdbfe', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Unique Interns</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1d4ed8', marginTop: '0.25rem' }}>{unique}</div>
        </div>
        <div style={{ flex: 1, padding: '0.75rem', background: '#ecfdf5', borderRadius: '12px', border: '1px solid #a7f3d0', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Returning Visits</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#047857', marginTop: '0.25rem' }}>{returning}</div>
        </div>
      </div>

      {!hasData ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          No internship check-in details available for this period.
        </div>
      ) : (
        <div style={{ flex: 1, width: '100%' }}>
          <div className="table-responsive" style={{ overflowX: 'auto' }}>
            <table className="records-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '0.75rem 1rem' }}>Mentor Name</th>
                  <th style={{ textAlign: 'right', padding: '0.75rem 1rem' }}>Visits</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((row, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'var(--text-primary)' }}>
                      {row.name}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 600 }}>
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}


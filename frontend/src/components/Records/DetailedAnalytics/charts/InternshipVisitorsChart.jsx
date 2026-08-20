import React from 'react';

export default function InternshipVisitorsChart({ stats, chartData }) {
  const { total = 0, unique = 0, returning = 0 } = stats || {};
  const hasData = chartData && chartData.length > 0;

  return (
    <div style={{ background: '#ffffff', border: '1px solid #000000', borderRadius: '8px', padding: '0.65rem 0.85rem', display: 'flex', flexDirection: 'column', flex: '1 1 100%', width: '100%', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
        Internship Visitors & Mentors
      </h4>

      {/* Mini KPI Cards row */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <div style={{ flex: 1, padding: '0.35rem 0.5rem', background: '#fef2f2', borderRadius: '6px', border: '1px solid #fecaca', textAlign: 'center' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Visits</div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>{total}</div>
        </div>
        <div style={{ flex: 1, padding: '0.35rem 0.5rem', background: '#eff6ff', borderRadius: '6px', border: '1px solid #bfdbfe', textAlign: 'center' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Unique Interns</div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1d4ed8' }}>{unique}</div>
        </div>
        <div style={{ flex: 1, padding: '0.35rem 0.5rem', background: '#ecfdf5', borderRadius: '6px', border: '1px solid #a7f3d0', textAlign: 'center' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Returning</div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#047857' }}>{returning}</div>
        </div>
      </div>

      {!hasData ? (
        <div style={{ minHeight: '175px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          No internship details available for this period.
        </div>
      ) : (
        <div style={{ width: '100%', height: '190px', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
            <thead style={{ position: 'sticky', top: 0, background: '#ffffff' }}>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: 'var(--text-secondary)', fontWeight: 700 }}>
                <th style={{ padding: '0.4rem 0.5rem' }}>Mentor / Organization</th>
                <th style={{ padding: '0.4rem 0.5rem', textAlign: 'right' }}>Visits</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.4rem 0.5rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                    {row.name}
                  </td>
                  <td style={{ padding: '0.4rem 0.5rem', textAlign: 'right', fontWeight: 800, color: 'var(--primary)' }}>
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

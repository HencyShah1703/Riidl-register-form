import React from 'react';

export default function QuickInsights({ insights }) {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(243,244,246,0.8))' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(162, 2, 2, 0.1)', color: 'var(--primary)' }}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
            <line x1="12" y1="2" x2="12" y2="12" />
          </svg>
        </div>
        <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.015em' }}>
          Quick Insights & Highlights
        </h4>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {insights.map((insight, idx) => (
          <div
            key={idx}
            className="stat-card glass-panel"
            style={{
              padding: '1.25rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              margin: 0
            }}
          >
            <div className="stat-icon-wrapper red" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', flexShrink: 0 }}>
              <svg 
                viewBox="0 0 24 24" 
                width="22" 
                height="22" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
              >
                <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A7 7 0 0 0 4 8c0 1.3.5 2.6 1.5 3.5.7.8 1.3 1.5 1.5 2.5" />
                <path d="M9 18h6M10 22h4" />
              </svg>
            </div>
            <div className="stat-details" style={{ flex: 1 }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.45 }}>
                {insight}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

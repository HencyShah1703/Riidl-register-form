import React from 'react';
import ExportMenu from './ExportMenu.jsx';

const LOCATIONS = [
  { value: '', label: 'All Locations' },
  { value: 'Riidl HQ', label: 'Riidl HQ' },
  { value: 'Bioriidl HQ', label: 'Bioriidl HQ' }
];

export default function AnalyticsFilters({
  period,
  setPeriod,
  customFrom,
  setCustomFrom,
  customTo,
  setCustomTo,
  location,
  setLocation,
  onBack,
  dashboardData,
  periodLabel,
  locationLabel
}) {
  return (
    <div className="dashboard-filters-panel" style={{ marginBottom: '1rem', background: '#f8fafc', border: '1px solid #000000', borderRadius: '8px', padding: '0.4rem 0.75rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', width: '100%' }}>
        
        {/* Column 1: Analysis Period */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Analysis Period</span>
          <div style={{ display: 'flex', gap: '0.2rem', background: '#e2e8f0', padding: '2px', borderRadius: '6px', width: 'fit-content' }}>
            {['week', 'month', 'year', 'custom'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                style={{
                  padding: '0.2rem 0.55rem',
                  fontSize: '0.73rem',
                  fontWeight: 600,
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  background: period === p ? 'var(--card-bg)' : 'transparent',
                  color: period === p ? 'var(--primary)' : 'var(--text-secondary)',
                  boxShadow: period === p ? '0 1px 2px rgba(0, 0, 0, 0.08)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {p === 'week' ? 'This Week' : p === 'month' ? 'This Month' : p === 'year' ? 'This Year' : 'Custom Range'}
              </button>
            ))}
          </div>
        </div>

        {/* Date range pickers shown inline if period is custom */}
        {period === 'custom' && (
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div className="filter-item" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <label htmlFor="customFrom" style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)' }}>From:</label>
              <input
                id="customFrom"
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                style={{
                  padding: '0.15rem 0.4rem',
                  fontSize: '0.75rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
            <div className="filter-item" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <label htmlFor="customTo" style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)' }}>To:</label>
              <input
                id="customTo"
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                style={{
                  padding: '0.15rem 0.4rem',
                  fontSize: '0.75rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
          </div>
        )}

        {/* Column 2: Location Filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <label htmlFor="locationFilter" style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location Filter</label>
          <div style={{ position: 'relative', width: '130px' }}>
            <select
              id="locationFilter"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{
                padding: '0.2rem 1.6rem 0.2rem 0.5rem',
                fontSize: '0.75rem',
                width: '100%',
                height: '24px',
                borderRadius: '4px',
                border: '1px solid var(--border-color)',
                background: 'var(--card-bg)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                appearance: 'none',
                cursor: 'pointer'
              }}
            >
              {LOCATIONS.map((loc) => (
                <option key={loc.value} value={loc.value}>
                  {loc.label}
                </option>
              ))}
            </select>
            <div style={{
              position: 'absolute',
              right: '0.4rem',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              color: 'var(--text-secondary)'
            }}>
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        </div>

        {/* Column 3: Actions (Pushed to the right) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', alignItems: 'flex-end', marginLeft: 'auto', width: '140px' }}>
          {/* Row 1 button: Back to Logs */}
          <button 
            onClick={onBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              height: '24px',
              width: '140px',
              padding: '0 0.45rem',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: 'var(--primary)',
              background: '#ffffff',
              border: '1px solid var(--primary)',
              borderRadius: '4px',
              cursor: 'pointer',
              letterSpacing: '0.05em',
              transition: 'all 0.15s ease'
            }}
          >
            <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="var(--primary)" strokeWidth="2.5" style={{ pointerEvents: 'none' }}>
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <pre>  Back to Logs</pre>
          </button>

          {/* Row 2 button: Export / Save */}
          <ExportMenu 
            dashboardData={dashboardData} 
            periodLabel={periodLabel} 
            locationLabel={locationLabel} 
            buttonWidth="140px"
          />
        </div>

      </div>
    </div>
  );
}

import React from 'react';

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
  setLocation
}) {
  return (
    <div className="dashboard-filters-panel" style={{ marginBottom: '1.5rem', background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        
        {/* Date period filters */}
        <div className="filter-item" style={{ flex: '1 1 auto', minWidth: '240px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Analysis Period</label>
          <div style={{ display: 'flex', gap: '0.4rem', background: '#e2e8f0', padding: '0.25rem', borderRadius: '8px', width: 'fit-content' }}>
            {['week', 'month', 'year', 'custom'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                style={{
                  padding: '0.45rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  background: period === p ? 'var(--card-bg)' : 'transparent',
                  color: period === p ? 'var(--primary)' : 'var(--text-secondary)',
                  boxShadow: period === p ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {p === 'week' ? 'This Week' : p === 'month' ? 'This Month' : p === 'year' ? 'This Year' : 'Custom Range'}
              </button>
            ))}
          </div>
        </div>

        {/* Location Dropdown */}
        <div className="filter-item" style={{ width: '220px' }}>
          <label htmlFor="locationFilter" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location Filter</label>
          <div style={{ position: 'relative', width: '100%' }}>
            <select
              id="locationFilter"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{
                padding: '0.55rem 2rem 0.55rem 0.85rem',
                fontSize: '0.88rem',
                width: '100%',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--card-bg)',
                color: 'var(--text-primary)',
                fontWeight: 500,
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
              right: '0.85rem',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              color: 'var(--text-secondary)'
            }}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Custom range date pickers */}
      {period === 'custom' && (
        <div 
          className="date-range-row" 
          style={{ 
            display: 'flex', 
            gap: '1rem', 
            marginTop: '1.25rem', 
            paddingTop: '1rem', 
            borderTop: '1px dashed var(--border-color)' 
          }}
        >
          <div className="filter-item" style={{ flex: '1 1 200px' }}>
            <label htmlFor="customFrom" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>From Date</label>
            <input
              id="customFrom"
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              style={{
                padding: '0.5rem 0.75rem',
                fontSize: '0.88rem',
                width: '100%',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
          <div className="filter-item" style={{ flex: '1 1 200px' }}>
            <label htmlFor="customTo" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>To Date</label>
            <input
              id="customTo"
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              style={{
                padding: '0.5rem 0.75rem',
                fontSize: '0.88rem',
                width: '100%',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { exportToPDF, exportToExcel, exportToCSV } from '../../../utils/exportAnalytics.js';

export default function ExportMenu({ dashboardData, periodLabel, locationLabel, buttonWidth = '140px' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExportPDF = async () => {
    if (!dashboardData) return;
    setIsExportingPDF(true);
    setIsOpen(false);
    await exportToPDF('analytics-report-container', periodLabel, locationLabel);
    setIsExportingPDF(false);
  };

  const handleExportExcel = () => {
    if (!dashboardData) return;
    setIsOpen(false);
    exportToExcel(dashboardData, periodLabel, locationLabel);
  };

  const handleExportCSV = (dataset) => {
    if (!dashboardData) return;
    setIsOpen(false);
    exportToCSV(dashboardData, dataset);
  };

  const isDisabled = !dashboardData || isExportingPDF;

  return (
    <div className="export-menu-container" ref={menuRef} style={{ position: 'relative', display: 'inline-block', width: buttonWidth }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isDisabled}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '24px',
          width: '100%',
          padding: '0.2rem 0.55rem',
          fontSize: '0.73rem',
          fontWeight: 600,
          borderRadius: '4px',
          border: 'none',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          opacity: isDisabled ? 0.7 : 1,
          background: 'var(--primary)',
          color: '#ffffff'
        }}
      >
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '0.25rem' }}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {isExportingPDF ? 'Exporting...' : 'Export / Save'}
        <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: '0.25rem' }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="glass-panel"
          style={{
            position: 'absolute',
            right: 0,
            top: '28px',
            width: '200px',
            zIndex: 100,
            padding: '0.35rem 0',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: '1px solid var(--border-color)',
            background: '#ffffff'
          }}
        >
          <button
            onClick={handleExportPDF}
            className="dropdown-item"
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              padding: '0.65rem 1.25rem',
              border: 'none',
              background: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '0.88rem',
              color: 'var(--text-primary)'
            }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#ef4444" strokeWidth="2.5" style={{ marginRight: '0.50rem' }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            Export PDF Report
          </button>

          <button
            onClick={handleExportExcel}
            className="dropdown-item"
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              padding: '0.65rem 1.25rem',
              border: 'none',
              background: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '0.88rem',
              color: 'var(--text-primary)'
            }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#10b981" strokeWidth="2.5" style={{ marginRight: '0.50rem' }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            Export Excel Workbook
          </button>

          <div style={{ borderTop: '1px solid var(--border-color)', margin: '0.35rem 0' }}></div>
          
          <div style={{ padding: '0.35rem 1.25rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Export CSV Dataset
          </div>

          {['overview', 'trend', 'purpose', 'colleges', 'visitorTypes', 'summary'].map((dataset) => (
            <button
              key={dataset}
              onClick={() => handleExportCSV(dataset)}
              className="dropdown-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: '0.45rem 1.5rem',
                border: 'none',
                background: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '0.82rem',
                color: 'var(--text-secondary)'
              }}
            >
              • {dataset === 'visitorTypes' ? 'Visitor Categories' : dataset.charAt(0).toUpperCase() + dataset.slice(1)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

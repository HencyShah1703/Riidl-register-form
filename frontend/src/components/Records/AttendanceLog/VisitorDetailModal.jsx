import React, { useState } from 'react';

// Renders the slide-up visitor modal containing their basic details and complete check-in history timeline
export default function VisitorDetailModal({
  selectedVisitor,
  onClose,
  modalPeriod,
  setModalPeriod,
  modalStart,
  setModalStart,
  modalEnd,
  setModalEnd,
  modalFilteredVisits,
  formatModalTime
}) {
  const [modalPage, setModalPage] = useState(1);
  const logsPerPage = 10;

  // Reset page when filters change
  React.useEffect(() => {
    setModalPage(1);
  }, [modalPeriod, modalStart, modalEnd]);

  const totalModalPages = Math.ceil(modalFilteredVisits.length / logsPerPage);
  const startIndex = (modalPage - 1) * logsPerPage;
  const paginatedVisits = modalFilteredVisits.slice(startIndex, startIndex + logsPerPage);

  return (
    <>
    <div className="records-dashboard detail-view-active animate-slide-up" style={{ width: '100%', maxWidth: '1100px', margin: '0 auto' }}>
      <div className="dashboard-header" style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem' }}>
        <button 
          onClick={onClose} 
          className="btn-secondary back-btn"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.88rem' }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Logs
        </button>
        <div>
          <h2>Visitor Details: {selectedVisitor.name}</h2>
          <p>Complete check-in history and details for this visitor.</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', minHeight: '60vh', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="visitor-detail-info-panel" style={{ margin: 0 }}>
          <h4 style={{ margin: '0 0 1.25rem 0', fontSize: '1.05rem', borderBottom: '1px dashed var(--border-color)', paddingBottom: '0.5rem', color: 'var(--text-primary)' }}>Basic Information</h4>
          
          <div className="visitor-info-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            <div className="info-item-row">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <div className="info-item-details">
                <span className="info-item-label">Name</span>
                <span className="info-item-value" style={{ fontWeight: '700', fontSize: '1rem' }}>{selectedVisitor.name}</span>
              </div>
            </div>

            <div className="info-item-row">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <div className="info-item-details">
                <span className="info-item-label">Email</span>
                <span className="info-item-value" style={{ fontSize: '1rem' }}>{selectedVisitor.email}</span>
              </div>
            </div>

            <div className="info-item-row">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <div className="info-item-details">
                <span className="info-item-label">Phone Number</span>
                <span className="info-item-value" style={{ fontSize: '1rem' }}>{selectedVisitor.phoneNumber}</span>
              </div>
            </div>

            <div className="info-item-row">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
              </svg>
              <div className="info-item-details">
                <span className="info-item-label">College / Institute</span>
                <span className="info-item-value" style={{ fontSize: '1rem' }}>{selectedVisitor.collegeName}</span>
              </div>
            </div>

            {selectedVisitor.iAm && (
              <div className="info-item-row">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <div className="info-item-details">
                  <span className="info-item-label">Category</span>
                  <span className="info-item-value" style={{ fontSize: '1rem' }}>{selectedVisitor.iAm}</span>
                </div>
              </div>
            )}

            {selectedVisitor.mentorName && (
              <div className="info-item-row">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                <div className="info-item-details">
                  <span className="info-item-label">Internship Mentor Name</span>
                  <span className="info-item-value" style={{ fontSize: '1rem', fontWeight: '700' }}>{selectedVisitor.mentorName}</span>
                </div>
              </div>
            )}

            {selectedVisitor.personToMeet && (
              <div className="info-item-row">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <polyline points="16 11 18 13 22 9" />
                </svg>
                <div className="info-item-details">
                  <span className="info-item-label">Person Name to Meet</span>
                  <span className="info-item-value" style={{ fontSize: '1rem', fontWeight: '700' }}>{selectedVisitor.personToMeet}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* History Filters (Horizontal Bar) */}
        <div className="modal-filter-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: '1 1 auto', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>Filter History :</span>
            <select
              id="modalPeriod"
              value={modalPeriod}
              onChange={(e) => {
                setModalPeriod(e.target.value);
                if (e.target.value !== 'custom') {
                  setModalStart('');
                  setModalEnd('');
                }
              }}
              style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem', borderRadius: '8px', border: '1px solid var(--border-color)', minWidth: '150px', background: '#fff' }}
            >
                <option value="all">All Time</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
                <option value="custom">Custom Range...</option>
            </select>
          </div>

          {modalPeriod === 'custom' && (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'nowrap' }}>
              <div className="filter-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label htmlFor="modalStart" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap', margin: 0 }}>From:</label>
                <input
                  id="modalStart"
                  type="date"
                  value={modalStart}
                  onChange={(e) => setModalStart(e.target.value)}
                  style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: '#fff' }}
                />
              </div>
              <div className="filter-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label htmlFor="modalEnd" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap', margin: 0 }}>To:</label>
                <input
                  id="modalEnd"
                  type="date"
                  value={modalEnd}
                  onChange={(e) => setModalEnd(e.target.value)}
                  style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: '#fff' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Timeline container (Full Width) */}
        <div className="modal-timeline-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
          <div className="modal-timeline-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Visit History Logs</span>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', background: 'rgba(162, 2, 2, 0.1)', color: '#A20202', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
              {modalFilteredVisits.length} {modalFilteredVisits.length === 1 ? 'visit' : 'visits'}
            </span>
          </div>

          <div className="timeline-items-list" style={{ maxHeight: '450px', overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {paginatedVisits.length > 0 ? (
              paginatedVisits.map((visit) => (
                <div key={visit._id} className="timeline-item-card" style={{ padding: '0.6rem 1rem', background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', fontSize: '0.88rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', width: '100%' }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.9rem' }}>
                      {formatModalTime(visit.timestamp)}
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>-</span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      <strong>Purpose:</strong> {visit.purposeOfVisit}
                      {visit.purposeOfVisit === 'Internship' && visit.mentorName && ` - (${visit.mentorName})`}
                      {visit.purposeOfVisit === 'To Meet Someone' && visit.personToMeet && ` - (${visit.personToMeet})`}
                    </span>
                    <span className="location-badge" style={{ background: '#f1f5f9', padding: '0.15rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', border: '1px solid #ef4444', color: 'var(--text-secondary)', fontWeight: 600, marginLeft: 'auto' }}>
                      {visit.location}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                No attendance logs found matching the selected period.
              </div>
            )}
          </div>

          {totalModalPages > 1 && (() => {
            const maxVisiblePages = 10;
            const startPage = Math.floor((modalPage - 1) / maxVisiblePages) * maxVisiblePages + 1;
            const endPage = Math.min(startPage + maxVisiblePages - 1, totalModalPages);
            const visiblePages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

            return (
              <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', gap: '0.35rem', marginTop: '1.25rem', alignItems: 'center' }}>
                <button 
                  disabled={modalPage === 1} 
                  onClick={() => setModalPage(p => Math.max(1, p - 1))}
                  className="btn-secondary"
                  style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem', borderRadius: '6px' }}
                >
                  Prev
                </button>
                {visiblePages.map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setModalPage(pageNum)}
                    className={`btn-secondary ${modalPage === pageNum ? 'active' : ''}`}
                    style={{
                      padding: '0.25rem 0.6rem',
                      fontSize: '0.8rem',
                      borderRadius: '6px',
                      backgroundColor: modalPage === pageNum ? 'var(--primary)' : '',
                      color: modalPage === pageNum ? '#fff' : '',
                      borderColor: modalPage === pageNum ? 'var(--primary)' : '',
                      minWidth: '32px',
                      cursor: 'pointer'
                    }}
                  >
                    {pageNum}
                  </button>
                ))}
                <button 
                  disabled={modalPage === totalModalPages} 
                  onClick={() => setModalPage(p => Math.min(totalModalPages, p + 1))}
                  className="btn-secondary"
                  style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem', borderRadius: '6px' }}
                >
                  Next
                </button>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
    </>
  );
}

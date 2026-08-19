import React from 'react';

// Renders the tabular log entries database table and dynamic grid cards for responsive mobile screens
export default function RecordsTable({ records, onViewDetails }) {
  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    const date = new Date(timeString);
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const dateOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    return `${date.toLocaleTimeString('en-US', timeOptions)} - ${date.toLocaleDateString('en-US', dateOptions)}`;
  };

  const isToday = (timeString) => {
    const today = new Date();
    const recordDate = new Date(timeString);
    return today.toDateString() === recordDate.toDateString();
  };

  if (records.length === 0) {
    return (
      <div className="empty-records-card glass-panel">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <line x1="8" y1="14" x2="16" y2="14" />
          <line x1="8" y1="18" x2="12" y2="18" />
        </svg>
        <h3>No Attendance Logs Found</h3>
        <p>New visitor check-ins will show up here in real time.</p>
      </div>
    );
  }

  return (
    <div className="records-table-container glass-panel animate-fade-in">
      <div className="table-responsive">
        <table className="records-table">
          <thead>
            <tr>
              <th>Visitor Details</th>
              <th>College</th>
              <th>I am</th>
              <th>Purpose of Visit</th>
              <th>Total Visits</th>
              <th>Check-in Time</th>
              <th>Location</th>
              <th>Other Details</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record._id} className={isToday(record.timestamp) ? 'today-row' : ''}>
                <td>
                  <div className="visitor-meta">
                    <span className="visitor-name">{record.name}</span>
                    <span className="visitor-contact">
                      {record.phoneNumber} &bull; {record.email}
                    </span>
                  </div>
                </td>
                <td>
                  <span className="college-badge">
                    {record.collegeName}
                  </span>
                </td>
                <td>
                  <span className="college-badge" style={{ background: '#ecfdf5', borderColor: '#a7f3d0', color: '#047857' }}>
                    {record.iAm || 'N/A'}
                  </span>
                </td>
                <td>
                  <span className="purpose-tag">
                    {record.purposeOfVisit}
                  </span>
                </td>
                <td>
                  <span style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    background: '#eff6ff', 
                    color: 'var(--primary)', 
                    fontWeight: 'bold', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '6px', 
                    fontSize: '0.82rem',
                    border: '1px solid #bfdbfe' 
                  }}>
                    {record.totalAttendance}
                  </span>
                </td>
                <td>
                  <div className="time-display">
                    {formatTime(record.timestamp)}
                    {isToday(record.timestamp) && <span className="today-badge">Today</span>}
                  </div>
                </td>
                <td>
                  <span className="location-pill">
                    {record.location}
                  </span>
                </td>
                <td>
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                    onClick={() => onViewDetails(record)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="mobile-records-list">
        {records.map((record) => (
          <div key={record._id} className={`mobile-record-card ${isToday(record.timestamp) ? 'today' : ''}`}>
            <div className="card-header">
              <span className="card-visitor-name">{record.name}</span>
              {isToday(record.timestamp) && <span className="today-badge">Today</span>}
            </div>
            <div className="card-contact-row">
              {record.phoneNumber} &bull; {record.email}
            </div>
            
            <div className="card-body-row">
              <span className="body-label">College:</span>
              <span className="body-val">{record.collegeName}</span>
            </div>
            <div className="card-body-row">
              <span className="body-label">I am:</span>
              <span className="body-val" style={{ color: '#047857' }}>{record.iAm || 'N/A'}</span>
            </div>
            <div className="card-body-row">
              <span className="body-label">Purpose:</span>
              <span className="body-val purpose-text">{record.purposeOfVisit}</span>
            </div>
            <div className="card-body-row">
              <span className="body-label">Total Visits:</span>
              <span className="body-val"><strong>{record.totalAttendance}</strong></span>
            </div>
            <div className="card-body-row">
              <span className="body-label">Time:</span>
              <span className="body-val">{formatTime(record.timestamp)}</span>
            </div>
            <div className="card-body-row">
              <span className="body-label">Location:</span>
              <span className="location-pill" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>{record.location}</span>
            </div>
            
            <div style={{ marginTop: '0.75rem', borderTop: '1px dashed var(--border-color)', paddingTop: '0.75rem' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ width: '100%', padding: '0.5rem', fontSize: '0.88rem' }}
                onClick={() => onViewDetails(record)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import RecordsHeader from './RecordsHeader.jsx';
import RecordsTable from './RecordsTable.jsx';

export default function Records({ adminEmail }) {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter and Sorting States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDraft, setSearchDraft] = useState('');
  const [timePeriod, setTimePeriod] = useState('all'); // 'all', 'week', 'month', 'year', 'custom'
  const [sortBy, setSortBy] = useState('date-desc'); // 'date-desc', 'date-asc', 'college', 'purpose', 'attendance'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modal Detail View States
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [modalPeriod, setModalPeriod] = useState('all'); // 'all', 'week', 'month', 'year', 'custom'
  const [modalStart, setModalStart] = useState('');
  const [modalEnd, setModalEnd] = useState('');

  const fetchRecords = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:5000/api/visitors/records?adminEmail=${encodeURIComponent(adminEmail)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to retrieve attendance logs');
      }

      setRecords(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (adminEmail) {
      fetchRecords();
    }
  }, [adminEmail]);

  // 1. Time Period Filtering
  const dateFilteredRecords = React.useMemo(() => {
    const now = new Date();
    return records.filter((r) => {
      if (!r.timestamp) return false;
      const date = new Date(r.timestamp);

      if (timePeriod === 'all') return true;

      if (timePeriod === 'week') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return date >= oneWeekAgo;
      }

      if (timePeriod === 'month') {
        const oneMonthAgo = new Date();
        oneMonthAgo.setDate(now.getDate() - 30);
        return date >= oneMonthAgo;
      }

      if (timePeriod === 'year') {
        const oneYearAgo = new Date();
        oneYearAgo.setDate(now.getDate() - 365);
        return date >= oneYearAgo;
      }

      if (timePeriod === 'custom') {
        if (!startDate && !endDate) return true;
        const start = startDate ? new Date(startDate) : new Date(0);
        if (startDate) start.setHours(0, 0, 0, 0);

        const end = endDate ? new Date(endDate) : new Date();
        if (endDate) end.setHours(23, 59, 59, 999);

        return date >= start && date <= end;
      }

      return true;
    });
  }, [records, timePeriod, startDate, endDate]);

  // Pre-calculate visitor check-in counts for "Total Attendance" sorting (scoped to selected time period)
  const visitorAttendanceCounts = React.useMemo(() => {
    const visitorDays = {};
    dateFilteredRecords.forEach((r) => {
      const key = (r.phoneNumber || r.email || r.name || '').trim().toLowerCase();
      if (key && r.timestamp) {
        const dateStr = new Date(r.timestamp).toDateString(); // e.g. "Tue Aug 11 2026"
        if (!visitorDays[key]) {
          visitorDays[key] = new Set();
        }
        visitorDays[key].add(dateStr);
      }
    });

    const counts = {};
    Object.keys(visitorDays).forEach((key) => {
      counts[key] = visitorDays[key].size;
    });
    return counts;
  }, [dateFilteredRecords]);

  // Helper to fetch check-in frequency
  const getVisitorAttendanceCount = (r) => {
    const key = (r.phoneNumber || r.email || r.name || '').trim().toLowerCase();
    return visitorAttendanceCounts[key] || 0;
  };

  // 2. Search & Sort Filtering
  const finalFilteredRecords = React.useMemo(() => {
    // A. Apply Search Filter
    let result = [...dateFilteredRecords];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (r) =>
          (r.name && r.name.toLowerCase().includes(q)) ||
          (r.email && r.email.toLowerCase().includes(q)) ||
          (r.phoneNumber && r.phoneNumber.toLowerCase().includes(q)) ||
          (r.collegeName && r.collegeName.toLowerCase().includes(q)) ||
          (r.iAm && r.iAm.toLowerCase().includes(q)) ||
          (r.purposeOfVisit && r.purposeOfVisit.toLowerCase().includes(q)) ||
          (r.location && r.location.toLowerCase().includes(q))
      );
    }

    // Map to attach totalAttendance (from the date-filtered set)
    result = result.map((r) => ({
      ...r,
      totalAttendance: getVisitorAttendanceCount(r)
    }));

    // B. Apply Sorting
    if (sortBy === 'date-desc') {
      result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } else if (sortBy === 'date-asc') {
      result.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    } else if (sortBy === 'college') {
      result.sort((a, b) => (a.collegeName || '').localeCompare(b.collegeName || ''));
    } else if (sortBy === 'purpose') {
      result.sort((a, b) => (a.purposeOfVisit || '').localeCompare(b.purposeOfVisit || ''));
    } else if (sortBy === 'attendance') {
      result.sort((a, b) => b.totalAttendance - a.totalAttendance);
    }

    return result;
  }, [dateFilteredRecords, searchQuery, sortBy, visitorAttendanceCounts]);

  // 3. Modal Specific Visit History Filtering (scoped to the selected visitor)
  const modalFilteredVisits = React.useMemo(() => {
    if (!selectedVisitor) return [];

    // Extract all historical check-in logs for this specific visitor (by matching phone number)
    const visits = records.filter(
      (r) => (r.phoneNumber || '').trim().toLowerCase() === (selectedVisitor.phoneNumber || '').trim().toLowerCase()
    );

    const now = new Date();
    return visits.filter((v) => {
      if (!v.timestamp) return false;
      const date = new Date(v.timestamp);

      if (modalPeriod === 'all') return true;

      if (modalPeriod === 'week') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return date >= oneWeekAgo;
      }

      if (modalPeriod === 'month') {
        const oneMonthAgo = new Date();
        oneMonthAgo.setDate(now.getDate() - 30);
        return date >= oneMonthAgo;
      }

      if (modalPeriod === 'year') {
        const oneYearAgo = new Date();
        oneYearAgo.setDate(now.getDate() - 365);
        return date >= oneYearAgo;
      }

      if (modalPeriod === 'custom') {
        if (!modalStart && !modalEnd) return true;
        const start = modalStart ? new Date(modalStart) : new Date(0);
        if (modalStart) start.setHours(0, 0, 0, 0);

        const end = modalEnd ? new Date(modalEnd) : new Date();
        if (modalEnd) end.setHours(23, 59, 59, 999);

        return date >= start && date <= end;
      }

      return true;
    });
  }, [selectedVisitor, records, modalPeriod, modalStart, modalEnd]);

  // Helper to format date display in the modal timeline list
  const formatModalTime = (timeString) => {
    if (!timeString) return 'N/A';
    const date = new Date(timeString);
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const dateOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    return `${date.toLocaleTimeString('en-US', timeOptions)} - ${date.toLocaleDateString('en-US', dateOptions)}`;
  };

  if (selectedVisitor) {
    return (
      <div className="records-dashboard detail-view-active animate-slide-up" style={{ width: '100%', maxWidth: '1100px', margin: '0 auto' }}>
        <div className="dashboard-header" style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem' }}>
          <button 
            onClick={() => setSelectedVisitor(null)} 
            className="btn-secondary back-btn"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.88rem' }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Attendance Logs
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
            </div>
          </div>

          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {/* History Filters */}
            <div style={{ flex: '1 1 300px' }}>
              <div className="modal-filter-bar" style={{ height: '100%', margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ margin: '0 0 1.25rem 0', fontSize: '1.05rem', color: 'var(--text-primary)', borderBottom: '1px dashed var(--border-color)', paddingBottom: '0.5rem' }}>Filter History</h4>
                <div className="filter-item" style={{ marginBottom: modalPeriod === 'custom' ? '1.25rem' : 0 }}>
                  <label htmlFor="modalPeriod" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>History Period</label>
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
                    style={{ padding: '0.6rem 0.8rem', fontSize: '0.9rem', width: '100%', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                  >
                    <option value="all">All Time</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                    <option value="custom">Custom Range...</option>
                  </select>
                </div>

                {modalPeriod === 'custom' && (
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="filter-item" style={{ flex: 1 }}>
                      <label htmlFor="modalStart" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>From</label>
                      <input
                        id="modalStart"
                        type="date"
                        value={modalStart}
                        onChange={(e) => setModalStart(e.target.value)}
                        style={{ padding: '0.6rem 0.8rem', fontSize: '0.9rem', width: '100%', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                      />
                    </div>
                    <div className="filter-item" style={{ flex: 1 }}>
                      <label htmlFor="modalEnd" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>To</label>
                      <input
                        id="modalEnd"
                        type="date"
                        value={modalEnd}
                        onChange={(e) => setModalEnd(e.target.value)}
                        style={{ padding: '0.6rem 0.8rem', fontSize: '0.9rem', width: '100%', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline container */}
            <div className="modal-timeline-container" style={{ flex: '2 1 500px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="modal-timeline-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Visit History Logs</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', background: 'rgba(162, 2, 2, 0.1)', color: '#A20202', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                  {modalFilteredVisits.length} {modalFilteredVisits.length === 1 ? 'visit' : 'visits'}
                </span>
              </div>

              <div className="timeline-items-list" style={{ maxHeight: '450px', overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {modalFilteredVisits.length > 0 ? (
                  modalFilteredVisits.map((visit) => (
                    <div key={visit._id} className="timeline-item-card" style={{ padding: '1rem', background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                      <div className="timeline-item-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.9rem' }}>
                          {formatModalTime(visit.timestamp)}
                        </span>
                        <span className="location-badge" style={{ background: '#f1f5f9', padding: '0.15rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', border: '1px solid #cbd5e1', fontWeight: 600 }}>
                          {visit.location}
                        </span>
                      </div>
                      <div className="timeline-item-body" style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: '700', marginRight: '0.35rem' }}>Purpose:</span>
                        <strong>{visit.purposeOfVisit}</strong>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    No attendance logs found matching the selected period.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="records-dashboard animate-slide-up">
      <div className="dashboard-header">
        <div>
          <h2>Attendance Log</h2>
          <p>Real-time list of visitors and check-ins at RIIDL HQ.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button 
            onClick={() => {
              window.history.pushState(null, '', '/analytics');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="btn-secondary refresh-btn"
            style={{ display: 'inline-flex', alignItems: 'center', height: '42px', padding: '0 1.25rem', fontSize: '0.88rem' }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '0.4rem', verticalAlign: 'middle', display: 'inline-block' }}>
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            Detailed Analytics
          </button>

          <button 
            onClick={fetchRecords} 
            disabled={isLoading}
            className="btn-secondary refresh-btn"
            style={{ display: 'inline-flex', alignItems: 'center', height: '42px', padding: '0 1.25rem' }}
          >
            <svg 
              className={`spinner-icon ${isLoading ? '' : 'paused'}`} 
              viewBox="0 0 24 24" 
              width="18" 
              height="18" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5"
              style={{ marginRight: '0.35rem', verticalAlign: 'middle', display: 'inline-block' }}
            >
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l.73-2.19" />
            </svg>
            Refresh Log
          </button>
        </div>
      </div>

      {error && <div className="error-alert">{error}</div>}

      {isLoading ? (
        <div className="dashboard-loading-card glass-panel">
          <svg className="spinner-icon" viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#A20202" strokeWidth="3">
            <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="8" />
          </svg>
          <p>Loading attendance data...</p>
        </div>
      ) : (
        <>
          {/* Filters Control Panel */}
          <div className="dashboard-filters-panel">
            <div className="filters-row">
              {/* Search Bar */}
              <div className="filter-item" style={{ flex: '2 1 300px' }}>
                <label htmlFor="search">Search Visitors</label>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSearchQuery(searchDraft);
                  }}
                  style={{ display: 'flex', gap: '0.5rem', width: '100%' }}
                >
                  <input
                    id="search"
                    type="text"
                    placeholder="Search by name, phone no, college, purpose..."
                    value={searchDraft}
                    onChange={(e) => setSearchDraft(e.target.value)}
                  />
                  <button 
                    type="submit" 
                    className="btn-primary" 
                    style={{ padding: '0.5rem 1rem' }}
                    title="Search"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </button>
                </form>
              </div>

              {/* Time Period Filter */}
              <div className="filter-item">
                <label htmlFor="timePeriod">Time Period</label>
                <select
                  id="timePeriod"
                  value={timePeriod}
                  onChange={(e) => {
                    setTimePeriod(e.target.value);
                    if (e.target.value !== 'custom') {
                      setStartDate('');
                      setEndDate('');
                    }
                  }}
                >
                  <option value="all">All Time</option>
                  <option value="week">This Week (Last 7 Days)</option>
                  <option value="month">This Month (Last 30 Days)</option>
                  <option value="year">This Year (Last 365 Days)</option>
                  <option value="custom">Custom Range...</option>
                </select>
              </div>

              {/* Sorting Filter */}
              <div className="filter-item">
                <label htmlFor="sortBy">Sort By</label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date-desc">Date (Newest First)</option>
                  <option value="date-asc">Date (Oldest First)</option>
                  <option value="college">College Name (A-Z)</option>
                  <option value="purpose">Purpose of Visit (A-Z)</option>
                  <option value="attendance">Total Attendance (Highest)</option>
                </select>
              </div>
            </div>

            {/* Custom Date Inputs */}
            {timePeriod === 'custom' && (
              <div className="date-range-row">
                <div className="filter-item">
                  <label htmlFor="startDate">From Date</label>
                  <input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="filter-item">
                  <label htmlFor="endDate">To Date</label>
                  <input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <RecordsHeader records={dateFilteredRecords} />
          <RecordsTable 
            records={finalFilteredRecords} 
            onViewDetails={(rec) => {
              setSelectedVisitor(rec);
              setModalPeriod('all');
              setModalStart('');
              setModalEnd('');
            }}
          />
        </>
      )}
    </div>
  );
}

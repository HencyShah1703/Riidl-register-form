import React, { useState, useEffect } from 'react';
import LogHeader from './LogHeader.jsx';
import FiltersPanel from './FiltersPanel.jsx';
import RecordsHeader from './RecordsHeader.jsx';
import RecordsTable from './RecordsTable.jsx';
import VisitorDetailModal from './VisitorDetailModal.jsx';

// Renders the complete check-in records database, filter dashboard, and detailed visitor history modal
export default function AttendanceLog({ onGoToAnalytics }) {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter and Sorting States
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
      const response = await fetch('http://localhost:5000/api/visitors/records');
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
    fetchRecords();
  }, []);

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
        const dateStr = new Date(r.timestamp).toDateString();
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
    if (searchDraft.trim()) {
      const q = searchDraft.toLowerCase().trim();
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
  }, [dateFilteredRecords, searchDraft, sortBy, visitorAttendanceCounts]);

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

  const [logPage, setLogPage] = useState(1);
  const logsPerPage = 10;

  // Reset page when search or filters change
  useEffect(() => {
    setLogPage(1);
  }, [searchDraft, timePeriod, sortBy, startDate, endDate]);

  const totalLogPages = Math.ceil(finalFilteredRecords.length / logsPerPage);
  const paginatedFinalRecords = finalFilteredRecords.slice((logPage - 1) * logsPerPage, logPage * logsPerPage);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  if (selectedVisitor) {
    return (
      <VisitorDetailModal
        selectedVisitor={selectedVisitor}
        onClose={() => setSelectedVisitor(null)}
        modalPeriod={modalPeriod}
        setModalPeriod={setModalPeriod}
        modalStart={modalStart}
        setModalStart={setModalStart}
        modalEnd={modalEnd}
        setModalEnd={setModalEnd}
        modalFilteredVisits={modalFilteredVisits}
        formatModalTime={formatModalTime}
      />
    );
  }

  return (
    <div className="records-dashboard animate-slide-up">
      <LogHeader
        onGoToAnalytics={onGoToAnalytics}
        onRefresh={fetchRecords}
        isLoading={isLoading}
      />

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
          <FiltersPanel
            searchDraft={searchDraft}
            setSearchDraft={setSearchDraft}
            onSearchSubmit={handleSearchSubmit}
            timePeriod={timePeriod}
            setTimePeriod={setTimePeriod}
            sortBy={sortBy}
            setSortBy={setSortBy}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />

          <RecordsHeader records={dateFilteredRecords} />
          
          <RecordsTable 
            records={paginatedFinalRecords} 
            onViewDetails={(rec) => {
              setSelectedVisitor(rec);
              setModalPeriod('all');
              setModalStart('');
              setModalEnd('');
            }}
          />

          {totalLogPages > 1 && (() => {
            const maxVisiblePages = 10;
            const startPage = Math.floor((logPage - 1) / maxVisiblePages) * maxVisiblePages + 1;
            const endPage = Math.min(startPage + maxVisiblePages - 1, totalLogPages);
            const visiblePages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

            return (
              <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', gap: '0.35rem', marginTop: '1.5rem', alignItems: 'center' }}>
                <button 
                  disabled={logPage === 1} 
                  onClick={() => setLogPage(p => Math.max(1, p - 1))}
                  className="btn-secondary"
                  style={{ padding: '0.35rem 0.85rem', fontSize: '0.82rem', borderRadius: '8px' }}
                >
                  Prev
                </button>
                {visiblePages.map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setLogPage(pageNum)}
                    className={`btn-secondary ${logPage === pageNum ? 'active' : ''}`}
                    style={{
                      padding: '0.35rem 0.85rem',
                      fontSize: '0.82rem',
                      borderRadius: '8px',
                      backgroundColor: logPage === pageNum ? 'var(--primary)' : '',
                      color: logPage === pageNum ? '#fff' : '',
                      borderColor: logPage === pageNum ? 'var(--primary)' : '',
                      minWidth: '35px',
                      cursor: 'pointer'
                    }}
                  >
                    {pageNum}
                  </button>
                ))}
                <button 
                  disabled={logPage === totalLogPages} 
                  onClick={() => setLogPage(p => Math.min(totalLogPages, p + 1))}
                  className="btn-secondary"
                  style={{ padding: '0.35rem 0.85rem', fontSize: '0.82rem', borderRadius: '8px' }}
                >
                  Next
                </button>
              </div>
            );
          })()}
        </>
      )}
    </div>
  );
}

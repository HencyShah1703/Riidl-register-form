import React from 'react';

// Renders the search input and sort/filter dropdown options for log filters
export default function FiltersPanel({
  searchDraft,
  setSearchDraft,
  onSearchSubmit,
  timePeriod,
  setTimePeriod,
  sortBy,
  setSortBy,
  startDate,
  setStartDate,
  endDate,
  setEndDate
}) {
  return (
    <div className="dashboard-filters-panel">
      <div className="filters-row">
        {/* Search Bar */}
        <div className="filter-item" style={{ flex: '2 1 300px' }}>
          <label htmlFor="search">Search Visitors</label>
          <form 
            onSubmit={onSearchSubmit}
            style={{ width: '100%' }}
          >
            <div className="input-wrapper">
              <svg className="input-icon" style={{ color: '#9ca3af' }} viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                id="search"
                type="text"
                placeholder="Search by name, phone no, college, purpose..."
                value={searchDraft}
                onChange={(e) => setSearchDraft(e.target.value)}
                style={{ paddingLeft: '2.75rem' }}
              />
            </div>
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
  );
}

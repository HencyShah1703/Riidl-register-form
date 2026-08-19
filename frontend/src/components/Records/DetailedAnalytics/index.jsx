import React, { useState, useEffect } from 'react';
import AnalyticsHeader from './AnalyticsHeader.jsx';
import AnalyticsFilters from './AnalyticsFilters.jsx';
import AnalyticsKPICards from './AnalyticsKPICards.jsx';
import AnalyticsChartsSection from './charts/index.jsx';
import { fetchDashboardData } from '../../../services/analyticsApi.js';
import { getPeriodDateRange } from '../../../utils/analyticsDates.js';

export default function AnalyticsComponent() {

  // 2. Analytics filter states
  const [period, setPeriod] = useState('week'); // 'week', 'month', 'year', 'custom'
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [location, setLocation] = useState(''); // empty = all

  // 3. Analytics data states
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [dataError, setDataError] = useState('');

  // Fetch dashboard data when parameters change
  const loadDashboard = async () => {

    setIsLoadingData(true);
    setDataError('');

    try {
      let fromStr = '';
      let toStr = '';

      if (period === 'custom') {
        fromStr = customFrom;
        toStr = customTo;
      } else {
        const range = getPeriodDateRange(period);
        fromStr = range.from;
        toStr = range.to;
      }

      const data = await fetchDashboardData('admin', {
        from: fromStr,
        to: toStr,
        location
      });

      setDashboardData(data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setDataError(err.message || 'Failed to retrieve analytics data.');
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (period !== 'custom' || (customFrom && customTo)) {
      loadDashboard();
    }
  }, [period, customFrom, customTo, location]);

  const handleGoBack = () => {
    window.history.pushState(null, '', '/visitor-analytics');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const getPeriodLabel = () => {
    if (period === 'week') return 'This Week (Last 7 Days)';
    if (period === 'month') return 'This Month (Last 30 Days)';
    if (period === 'year') return 'This Year (Last 365 Days)';
    if (period === 'custom') {
      return customFrom && customTo ? `${customFrom} to ${customTo}` : 'Custom Date Range';
    }
    return '';
  };

  const getLocationLabel = () => {
    return location || 'All Locations';
  };

  return (
    <div className="page-wrapper" style={{ width: '100%', maxWidth: '1350px', margin: '0 auto', padding: '0px 1rem 0.75rem 1rem' }}>
      

      <AnalyticsFilters 
        period={period}
        setPeriod={setPeriod}
        customFrom={customFrom}
        setCustomFrom={setCustomFrom}
        customTo={customTo}
        setCustomTo={setCustomTo}
        location={location}
        setLocation={setLocation}
        onBack={handleGoBack}
        dashboardData={dashboardData}
        periodLabel={getPeriodLabel()}
        locationLabel={getLocationLabel()}
      />

      {dataError && (
        <div className="error-alert" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{dataError}</span>
          <button 
            type="button" 
            onClick={loadDashboard} 
            className="btn-secondary" 
            style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', background: '#ffffff', color: '#b91c1c', border: '1px solid #fca5a5' }}
          >
            Retry
          </button>
        </div>
      )}

      {!isLoadingData && dashboardData && (
        <div id="analytics-report-container" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', padding: '0.5rem 0' }}>
          <AnalyticsKPICards overview={dashboardData.overview} />

          <AnalyticsChartsSection dashboardData={dashboardData} />

        </div>
      )}

      {period === 'custom' && (!customFrom || !customTo) && !isLoadingData && (
        <div className="empty-records-card glass-panel" style={{ minHeight: '300px', border: '1px solid #000000', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
          </svg>
          <h3>Please Select a Custom Date Range</h3>
          <p>Choose standard dates in the controls above to load detailed analytics.</p>
        </div>
      )}

    </div>
  );
}

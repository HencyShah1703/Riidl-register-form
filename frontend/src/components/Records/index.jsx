import React from 'react';
import AttendanceLog from './AttendanceLog/index.jsx';
import DetailedAnalytics from './DetailedAnalytics/index.jsx';

// Entry point for records section, switching between logs and analytics
export default function Records({ subPage }) {
  const goToAnalytics = () => {
    window.history.pushState(null, '', '/detailed-analytics');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  if (subPage === 'analytics') {
    return <DetailedAnalytics />;
  }

  return (
    <div className="page-wrapper records-page" style={{ width: '100%' }}>
      <AttendanceLog onGoToAnalytics={goToAnalytics} />
    </div>
  );
}

import React from 'react';
import NewUsersTrend from './NewUsersTrend.jsx';
import CollegeChart from './CollegeChart.jsx';
import PurposeChart from './PurposeChart.jsx';
import VisitorTypeChart from './VisitorTypeChart.jsx';
import VisitorRatioChart from './VisitorRatioChart.jsx';
import VisitorRatioBreakdownChart from './VisitorRatioBreakdownChart.jsx';
import InternshipVisitorsChart from './InternshipVisitorsChart.jsx';
import PurposeDetailsChart from './PurposeDetailsChart.jsx';

export default function AnalyticsChartsSection({ dashboardData }) {
  if (!dashboardData) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
      {/* 1. New Users Trend Over Time */}
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', width: '100%' }}>
        <NewUsersTrend data={dashboardData.newUsersTrend} />
      </div>

      {/* 2. New Users by College (Full Row) */}
      <div style={{ display: 'flex', gap: '1.5rem', width: '100%' }}>
        <CollegeChart data={dashboardData.colleges} />
      </div>

      {/* 3. Base Donut/Pie Charts (2 in a row) */}
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', width: '100%' }}>
        <PurposeChart data={dashboardData.purpose} />
        <VisitorTypeChart data={dashboardData.visitorTypes} />
        <VisitorRatioChart data={dashboardData.visitorRatio || [
          { name: 'New Visitors', value: dashboardData.overview?.totalNewUsers || 0 },
          { name: 'Returning Visitors', value: dashboardData.overview?.totalReturningUsers || 0 }
        ]} />
      </div>

      {/* 4. New vs Returning Stacked Bar */}
      <div style={{ display: 'flex', gap: '1.5rem', width: '100%' }}>
        <VisitorRatioBreakdownChart data={dashboardData.newVsReturningByPurpose} />
      </div>

      {/* 5. Internship Visitors & Mentors Table */}
      <div style={{ display: 'flex', gap: '1.5rem', width: '100%' }}>
        <InternshipVisitorsChart 
          stats={dashboardData.internshipStats} 
          chartData={dashboardData.purposeDetails?.internship} 
        />
      </div>

      {/* 5. Detailed Purpose tables & charts */}
      <PurposeDetailsChart data={dashboardData.purposeDetails} />
    </div>
  );
}

import React from 'react';
import CollegeChart from './CollegeChart.jsx';
import NewUsersTrend from './NewUsersTrend.jsx';
import PurposeChart from './PurposeChart.jsx';
import VisitorTypeChart from './VisitorTypeChart.jsx';
import VisitorRatioBreakdownChart from './VisitorRatioBreakdownChart.jsx';
import InternshipVisitorsChart from './InternshipVisitorsChart.jsx';
import PurposeDetailsChart from './PurposeDetailsChart.jsx';

export default function AnalyticsChartsSection({ dashboardData }) {
  if (!dashboardData) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', width: '100%' }}>
      
      {/* 1. FIRST CHART: New Visitor Registrations Over Time & New Visitors by SVU Institutes side-by-side */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '0.45rem', width: '100%' }}>
        <NewUsersTrend data={dashboardData.newUsersTrend} />
        <CollegeChart data={dashboardData.colleges} />
      </div>

      {/* 2. Donut / Pie Charts Row (2 cards side-by-side) */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', width: '100%' }}>
        <div style={{ flex: '1 1 300px', display: 'flex' }}>
          <PurposeChart data={dashboardData.purpose} />
        </div>
        <div style={{ flex: '1 1 300px', display: 'flex' }}>
          <VisitorTypeChart data={dashboardData.visitorTypes} />
        </div>
      </div>

      {/* 3. New vs Returning Stacked Bar & Internship Visitors side-by-side */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '0.45rem', width: '100%' }}>
        <VisitorRatioBreakdownChart data={dashboardData.newVsReturningByPurpose} />
        <InternshipVisitorsChart 
          stats={dashboardData.internshipStats} 
          chartData={dashboardData.purposeDetails?.internship} 
        />
      </div>

      {/* 4. Detailed Purpose Breakdown */}
      <PurposeDetailsChart data={dashboardData.purposeDetails} />
    </div>
  );
}

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

/**
 * Exports the dashboard container to a PDF report.
 * 
 * @param {string} containerId 
 * @param {string} periodLabel 
 * @param {string} locationLabel 
 */
export async function exportToPDF(containerId, periodLabel, locationLabel) {
  const element = document.getElementById(containerId);
  if (!element) return;

  // Temporarily adjust any styles for clean capture (e.g. scrollbars)
  const originalStyle = element.style.maxHeight;
  element.style.maxHeight = 'none';

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // increases resolution/sharpness of charts and text
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210; // A4 size page width in mm
    const pageHeight = 297; // A4 size page height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Multipage timeline check
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const cleanPeriod = periodLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const cleanLocation = locationLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    pdf.save(`attendance_insights_${cleanPeriod}_${cleanLocation}.pdf`);
  } catch (err) {
    console.error('Failed to export PDF:', err);
    alert('An error occurred during PDF generation. Please try again.');
  } finally {
    element.style.maxHeight = originalStyle;
  }
}

/**
 * Exports the dashboard dataset to a formatted Excel workbook with separate sheets.
 * 
 * @param {object} dashboardData 
 * @param {string} periodLabel 
 * @param {string} locationLabel 
 */
export function exportToExcel(dashboardData, periodLabel, locationLabel) {
  const { overview, newUsersTrend, purpose, colleges, visitorTypes, summary } = dashboardData;

  const wb = XLSX.utils.book_new();

  // Sheet 1: Overview
  const overviewRows = [
    ['Attendance Insights Report', ''],
    ['Report Period', periodLabel],
    ['Location Filter', locationLabel],
    ['Exported At', new Date().toLocaleString()],
    ['', ''],
    ['Key Performance Indicators', ''],
    ['Total New Visitors', overview.totalNewUsers],
    ['Total Visits', overview.totalVisits],
    ['Unique Visitors Today', overview.visitorsToday],
    ['New Visitors Today', overview.newVisitorsToday],
    ['Already Registered Visitors Today', overview.returningVisitorsToday]
  ];
  const wsOverview = XLSX.utils.aoa_to_sheet(overviewRows);
  XLSX.utils.book_append_sheet(wb, wsOverview, 'Overview');

  // Sheet 2: New Visitors Trend
  const trendRows = [
    ['Date', 'First-Time Registrations'],
    ...newUsersTrend.map(t => [t.date, t.count])
  ];
  const wsTrend = XLSX.utils.aoa_to_sheet(trendRows);
  XLSX.utils.book_append_sheet(wb, wsTrend, 'New Visitor Trend');

  // Sheet 3: Purpose of Visit
  const purposeRows = [
    ['Purpose of Visit', 'New Registrations Count'],
    ...purpose.map(p => [p.name, p.value])
  ];
  const wsPurpose = XLSX.utils.aoa_to_sheet(purposeRows);
  XLSX.utils.book_append_sheet(wb, wsPurpose, 'Purpose Breakdown');

  // Sheet 4: College / Institute
  const collegeRows = [
    ['College / Institute Name', 'New Registrations Count'],
    ...colleges.map(c => [c.name, c.value])
  ];
  const wsCollege = XLSX.utils.aoa_to_sheet(collegeRows);
  XLSX.utils.book_append_sheet(wb, wsCollege, 'College Breakdown');

  // Sheet 5: Visitor Types ("I Am")
  const typeRows = [
    ['Visitor Category', 'New Registrations Count'],
    ...visitorTypes.map(v => [v.name, v.value])
  ];
  const wsType = XLSX.utils.aoa_to_sheet(typeRows);
  XLSX.utils.book_append_sheet(wb, wsType, 'Category Breakdown');

  // Sheet 6: Periodic Summary
  const summaryRows = [
    ['Time Period', 'New Visitors (First-time)', 'Total Visits (Logs)', 'Unique Visitors'],
    ...Object.entries(summary).map(([key, val]) => [
      key.toUpperCase(),
      val.newUsers,
      val.totalVisits,
      val.visitors
    ])
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Periodic Summary');

  const cleanPeriod = periodLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  const cleanLocation = locationLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  XLSX.writeFile(wb, `attendance_insights_${cleanPeriod}_${cleanLocation}.xlsx`);
}

/**
 * Exports a specific sub-dataset from the dashboard to a CSV file.
 * 
 * @param {object} dashboardData 
 * @param {string} datasetName - 'overview' | 'trend' | 'purpose' | 'colleges' | 'visitorTypes' | 'summary'
 */
export function exportToCSV(dashboardData, datasetName) {
  let headers = [];
  let rows = [];

  if (datasetName === 'trend') {
    headers = ['Date', 'New Visitors'];
    rows = dashboardData.newUsersTrend.map(t => [t.date, t.count]);
  } else if (datasetName === 'purpose') {
    headers = ['Purpose of Visit', 'Count'];
    rows = dashboardData.purpose.map(p => [p.name, p.value]);
  } else if (datasetName === 'colleges') {
    headers = ['College', 'Count'];
    rows = dashboardData.colleges.map(c => [c.name, c.value]);
  } else if (datasetName === 'visitorTypes') {
    headers = ['Visitor Category (I Am)', 'Count'];
    rows = dashboardData.visitorTypes.map(v => [v.name, v.value]);
  } else if (datasetName === 'summary') {
    headers = ['Period', 'New Visitors', 'Total Visits', 'Unique Visitors'];
    rows = Object.entries(dashboardData.summary).map(([key, val]) => [
      key,
      val.newUsers,
      val.totalVisits,
      val.visitors
    ]);
  } else {
    // Default to Overview KPIs
    headers = ['Metric', 'Count'];
    const { overview } = dashboardData;
    rows = [
      ['Total New Visitors', overview.totalNewUsers],
      ['Total Visits', overview.totalVisits],
      ['Visitors Today', overview.visitorsToday],
      ['New Visitors Today', overview.newVisitorsToday],
      ['Already Registered Visitors Today', overview.returningVisitorsToday]
    ];
  }

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `attendance_insights_${datasetName}_export.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

import React from 'react';

// Renders the visit check-in record details (Name, College, Category, Purpose, Time, Location)
export default function ReceiptDetails({ record, formattedTime }) {
  return (
    <div className="receipt-details">
      <h4 className="details-header">Visit Details</h4>
      
      <div className="detail-row">
        <span className="detail-label">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Name
        </span>
        <span className="detail-value">{record.name}</span>
      </div>

      <div className="detail-row">
        <span className="detail-label">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
          </svg>
          College
        </span>
        <span className="detail-value">{record.collegeName}</span>
      </div>

      {record.iAm && (
        <div className="detail-row">
          <span className="detail-label">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            I am
          </span>
          <span className="detail-value">{record.iAm}</span>
        </div>
      )}

      <div className="detail-row">
        <span className="detail-label">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          Purpose
        </span>
        <span className="detail-value">{record.purposeOfVisit}</span>
      </div>

      <div className="detail-row">
        <span className="detail-label">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Time
        </span>
        <span className="detail-value">{formattedTime}</span>
      </div>

      <div className="detail-row">
        <span className="detail-label">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          Location
        </span>
        <span className="detail-value">{record.location}</span>
      </div>
    </div>
  );
}

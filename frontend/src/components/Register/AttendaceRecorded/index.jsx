import React, { useEffect } from 'react';
import ReceiptHeader from './ReceiptHeader.jsx';
import NewEntryButton from './NewEntryButton.jsx';

// Attendance Recorded check-in confirmation card
export default function AttendaceRecorded({ record, onReset, isNewVisitor }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onReset();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onReset]);

  const formatTime = (timeString) => {
    if (!timeString) return 'Just now';
    const date = new Date(timeString);
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const dateOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    return `${date.toLocaleTimeString('en-US', timeOptions)}, ${date.toLocaleDateString('en-US', dateOptions)}`;
  };

  if (!record) return null;

  return (
    <div className="success-receipt animate-fade-in">
      <ReceiptHeader record={record} isNewVisitor={isNewVisitor} />
      {//<ReceiptDetails record={record} formattedTime={formatTime(record.timestamp)} />
      }
      <NewEntryButton onReset={onReset} />
    </div>
  );
}

import React from 'react';
import RecordsComponent from '../../components/Records/index.jsx';

// Renders the visitor log database or detailed analytics depending on selected tab
export default function Records({ subPage }) {
  return (
    <RecordsComponent subPage={subPage} />
  );
}

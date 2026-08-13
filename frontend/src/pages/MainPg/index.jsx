import React from 'react';
import MainPgComponent from '../../components/MainPg/index.jsx';

export default function MainPg({ onSelectFlow, onUserFound }) {
  return (
    <div className="page-wrapper main-pg-page">
      <MainPgComponent onSelectFlow={onSelectFlow} onUserFound={onUserFound} />
    </div>
  );
}

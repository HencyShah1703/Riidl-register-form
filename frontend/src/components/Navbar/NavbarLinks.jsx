import React from 'react';

// Renders the navigation links (Register and Records) on the navbar
export default function NavbarLinks({ currentPage, setCurrentPage }) {
  return (
    <div className="navbar-links">
      <button 
        className={`nav-btn ${['main', 'new-user', 'registered-user'].includes(currentPage) ? 'active' : ''}`}
        onClick={() => setCurrentPage('main')}
      >
        Register
      </button>
      <button 
        className={`nav-btn ${currentPage === 'records' || currentPage === 'analytics' ? 'active' : ''}`}
        onClick={() => setCurrentPage('records')}
      >
        Records
      </button>
    </div>
  );
}

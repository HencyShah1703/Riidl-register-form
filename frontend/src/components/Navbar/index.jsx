import React from 'react';
import riidlLogo from '../../assets/riidl_logo.png';

export default function Navbar({ currentPage, setCurrentPage }) {
  return (
    <nav className="navbar glass-panel">
      <div className="navbar-logo" onClick={() => setCurrentPage('main')}>
        <img className="logo-img" src={riidlLogo} alt="RIIDL Logo" />
      </div>
      
      <div className="navbar-links">
        <button 
          className={`nav-btn ${['main', 'new-user', 'registered-user'].includes(currentPage) ? 'active' : ''}`}
          onClick={() => setCurrentPage('main')}
        >
          Register
        </button>
        <button 
          className={`nav-btn ${currentPage === 'records' ? 'active' : ''}`}
          onClick={() => setCurrentPage('records')}
        >
          Records
        </button>
      </div>
    </nav>
  );
}

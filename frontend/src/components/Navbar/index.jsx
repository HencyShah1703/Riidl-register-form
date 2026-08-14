import React from 'react';
import NavbarLogo from './NavbarLogo.jsx';
import NavbarLinks from './NavbarLinks.jsx';

// Main Navbar component combining logo and links sections
export default function Navbar({ currentPage, setCurrentPage }) {
  return (
    <nav className="navbar glass-panel">
      <NavbarLogo onClick={() => setCurrentPage('main')} />
      <NavbarLinks currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </nav>
  );
}

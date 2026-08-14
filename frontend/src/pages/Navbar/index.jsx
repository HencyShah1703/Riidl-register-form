import React from 'react';
import NavbarComponent from '../../components/Navbar/index.jsx';

// Renders the main application navigation header bar
export default function Navbar({ currentPage, setCurrentPage }) {
  return (
    <NavbarComponent 
      currentPage={currentPage} 
      setCurrentPage={setCurrentPage} 
    />
  );
}

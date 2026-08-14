import React from 'react';
import riidlLogo from '../../assets/riidl_logo.png';

// Renders the RIIDL logo on the navbar
export default function NavbarLogo({ onClick }) {
  return (
    <div className="navbar-logo" onClick={onClick}>
      <img className="logo-img" src={riidlLogo} alt="RIIDL Logo" />
    </div>
  );
}

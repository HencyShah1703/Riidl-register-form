import React from 'react';
import riidlLogo from '../../../assets/riidl_logo.png';

// Renders the welcome banner with RIIDL logo and startup tagline
export default function LogoHeader() {
  return (
    <div className="header-logo-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
      <img src={riidlLogo} alt="RIIDL Logo" style={{ height: '70px', width: 'auto', objectFit: 'contain', marginBottom: '0.75rem' }} />
      <div style={{ fontWeight: 'bold', fontSize: '1.35rem', color: '#1f2937', fontFamily: 'var(--font-title)' }}>Welcome to Riidl</div>
      <div style={{ fontSize: '0.95rem', color: '#4b5563', fontFamily: 'var(--font-body)' }}>A place to build your startup</div>
    </div>
  );
}

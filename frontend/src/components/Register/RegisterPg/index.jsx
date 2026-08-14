import React, { useState } from 'react';
import LogoHeader from './LogoHeader.jsx';
import SearchForm from './SearchForm.jsx';
import NewVisitorPrompt from './NewVisitorPrompt.jsx';

// Welcomes returning visitors and checks if their number is registered
export default function RegisterPg({ onSelectFlow, onUserFound }) {
  const [countryCode, setCountryCode] = useState('91');
  const [localNumber, setLocalNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    const cleanCC = countryCode.trim().replace(/\D/g, '');
    const cleanLN = localNumber.trim().replace(/\D/g, '');
    const combinedPhone = `+${cleanCC}${cleanLN}`;
    if (!cleanLN) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/visitors/search?phone=${encodeURIComponent(combinedPhone)}`);
      const data = await response.json();

      if (response.status === 404) {
        throw new Error('This number is not registered. Please register as a New Visitor below.');
      } else if (!response.ok) {
        throw new Error(data.message || 'Error occurred while retrieving details');
      }

      onUserFound(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="terminal-card glass-panel animate-fade-in">
      <LogoHeader />

      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: '500' }}>
          Enter your registered mobile number to fetch your details.
        </p>
      </div>

      {error && <div className="error-alert">{error}</div>}

      <SearchForm
        countryCode={countryCode}
        setCountryCode={setCountryCode}
        localNumber={localNumber}
        setLocalNumber={setLocalNumber}
        isLoading={isLoading}
        onSubmit={handleSearch}
        onClearError={() => setError(null)}
      />

      <NewVisitorPrompt onSelectNewVisitor={() => onSelectFlow('new')} />
    </div>
  );
}

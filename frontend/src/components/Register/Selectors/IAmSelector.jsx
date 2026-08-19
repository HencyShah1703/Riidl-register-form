import React, { useState, useEffect, useRef } from 'react';

const ROLES = [
  'Other',
  'Student',
  'Startup',
  'Faculty',
  'Somaiya Management',
  'VC & Angel investors'
];

// Renders the searchable category role dropdown selector (e.g. Student, Startup, Faculty), with manual entry support
export default function IAmSelector({ value, onChange, disabled, isPrefilled }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOther, setIsOther] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const containerRef = useRef(null);

  // Initialize and sync state based on value passed from parent
  useEffect(() => {
    if (!value) {
      setSearchTerm('');
      setIsOther(false);
      setCustomValue('');
    } else if (ROLES.includes(value)) {
      if (value === 'Other') {
        setIsOther(true);
        setSearchTerm('Other');
      } else {
        setSearchTerm(value);
        setIsOther(false);
      }
    } else {
      // Custom value entered via the "Other" option
      setIsOther(true);
      setSearchTerm('Other');
      setCustomValue(value);
    }
  }, [value]);

  // Close dropdown on clicking outside the component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const text = e.target.value;
    setSearchTerm(text);
    setIsOpen(true);
    
    // If user clears the input, clear in parent form too
    if (!text) {
      onChange({ target: { name: 'iAm', value: '' } });
    }
  };

  const handleSelectOption = (option) => {
    if (option === 'Other') {
      setIsOther(true);
      setSearchTerm('Other');
      onChange({ target: { name: 'iAm', value: customValue || '' } });
    } else {
      setIsOther(false);
      setSearchTerm(option);
      onChange({ target: { name: 'iAm', value: option } });
    }
    setIsOpen(false);
  };

  const handleCustomValueChange = (e) => {
    const text = e.target.value;
    setCustomValue(text);
    onChange({ target: { name: 'iAm', value: text } });
  };

  // Filter list of roles based on typed text
  const filteredRoles = ROLES.filter((r) => {
    if (r === 'Other') return true;
    if (searchTerm === value || searchTerm === 'Other') return true;
    return r.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="college-selector-container" ref={containerRef}>
      <div className={`input-wrapper ${isPrefilled ? 'prefilled-highlight' : ''} ${disabled ? 'disabled' : ''}`}>
        <svg className="input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <input
          type="text"
          placeholder="Search or select role..."
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => setIsOpen(true)}
          disabled={disabled}
          required={!isOther}
        />
        <svg 
          className="select-chevron" 
          viewBox="0 0 24 24" 
          width="16" 
          height="16" 
          fill="none" 
          stroke="#9ca3af" 
          strokeWidth="2.5"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          style={{ 
            transform: isOpen ? 'rotate(180deg)' : 'none'
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {isOpen && !disabled && (
        <ul className="college-dropdown-list">
          {filteredRoles.length > 0 ? (
            filteredRoles.map((role, idx) => (
              <li 
                key={idx}
                onClick={() => handleSelectOption(role)}
                style={{
                  padding: '0.65rem 0.85rem',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  color: role === 'Other' ? 'var(--primary)' : 'var(--text-primary)',
                  fontWeight: role === 'Other' ? '700' : '500',
                  borderBottom: role === 'Other' ? '1px dashed var(--border-color)' : 'none',
                  marginBottom: role === 'Other' ? '0.35rem' : '0',
                  background: 'transparent',
                  transition: 'background var(--transition-fast)'
                }}
                onMouseEnter={(e) => { e.target.style.background = '#f1f5f9'; }}
                onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
              >
                {role}
              </li>
            ))
          ) : (
            <li style={{ padding: '0.75rem', fontSize: '0.88rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
              No matches found. Select "Other" below to enter manually.
              <div 
                onClick={() => handleSelectOption('Other')}
                style={{
                  marginTop: '0.5rem',
                  color: 'var(--primary)',
                  fontWeight: '700',
                  cursor: 'pointer',
                  padding: '0.35rem',
                  borderRadius: '6px'
                }}
                onMouseEnter={(e) => { e.target.style.background = '#f1f5f9'; }}
                onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
              >
                Choose "Other"
              </div>
            </li>
          )}
        </ul>
      )}

      {isOther && (
        <div className="input-group animate-fade-in" style={{ marginTop: '1rem' }}>
          <label htmlFor="customIAm">Specify Role <span className="required">*</span></label>
          <div className="input-wrapper">
            <svg className="input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
            <input
              id="customIAm"
              type="text"
              placeholder="Enter your role"
              value={customValue}
              onChange={handleCustomValueChange}
              required
              disabled={disabled}
            />
          </div>
        </div>
      )}
    </div>
  );
}

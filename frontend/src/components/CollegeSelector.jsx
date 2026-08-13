import React, { useState, useEffect, useRef } from 'react';

const COLLEGES = [
  'Other',
  'K J Somaiya School of Engineering',
  'K J Somaiya Institute of Management',
  'Dr. Shantilal K. Somaiya School of Commerce and Business Studies',
  'Somaiya School of Basic and Applied Sciences',
  'Somaiya School of Humanities and Social Sciences',
  'K J Somaiya School of Education',
  'K J Somaiya School of Languages and Literature',
  'Somaiya School of Design',
  'Dr. Shantilal K. Somaiya School of Art',
  'Somaiya School of Civilisation Studies',
  'Maya Somaiya School of Music and Performing Arts',
  'Somaiya Dhwani Chitram',
  'K J Somaiya Institute of Dharma Studies',
  'Department of Library and Information Science',
  'K J Somaiya College of Nursing',
  'K J Somaiya Medical College and Research Centre',
  'K J Somaiya Institute of Physiotherapy',
  'K J Somaiya Institute of Technology',
  'K J Somaiya Polytechnic',
  'K J Somaiya Private Industrial Institute',
  'K J Somaiya College of Arts and Commerce',
  'K J Somaiya College of Science and Commerce',
  'K J Somaiya Junior College',
  'S K Somaiya College',
  'K J Somaiya College of Education',
  'K J Somaiya Institute of Engineering and Information Technology',
  'Somaiya Vidyavihar University Research Centres',
  'Research, Innovation, Incubation Design Laboratory (RiiDL)',
  'Somaiya Sports Academy',
  'Somaiya Vidyavihar International School',
  'Somaiya School',
  'Somaiya Vidyavihar High School',
  'Somaiya Vidyavihar Mandir',
  'K J Somaiya College of Physiotherapy'
];

export default function CollegeSelector({ value, onChange, disabled, isPrefilled }) {
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
    } else if (COLLEGES.includes(value)) {
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
      onChange({ target: { name: 'collegeName', value: '' } });
    }
  };

  const handleSelectOption = (option) => {
    if (option === 'Other') {
      setIsOther(true);
      setSearchTerm('Other');
      onChange({ target: { name: 'collegeName', value: customValue || '' } });
    } else {
      setIsOther(false);
      setSearchTerm(option);
      onChange({ target: { name: 'collegeName', value: option } });
    }
    setIsOpen(false);
  };

  const handleCustomValueChange = (e) => {
    const text = e.target.value;
    setCustomValue(text);
    onChange({ target: { name: 'collegeName', value: text } });
  };

  // Filter list of colleges based on typed text
  const filteredColleges = COLLEGES.filter((c) => {
    if (c === 'Other') return true;
    return c.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="college-selector-container" ref={containerRef}>
      <div className={`input-wrapper ${isPrefilled ? 'prefilled-highlight' : ''} ${disabled ? 'disabled' : ''}`}>
        <svg className="input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
        </svg>
        <input
          type="text"
          placeholder="Search or select college..."
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
          {filteredColleges.length > 0 ? (
            filteredColleges.map((col, idx) => (
              <li 
                key={idx}
                onClick={() => handleSelectOption(col)}
                style={{
                  padding: '0.65rem 0.85rem',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  color: col === 'Other' ? 'var(--primary)' : 'var(--text-primary)',
                  fontWeight: col === 'Other' ? '700' : '500',
                  borderBottom: col === 'Other' ? '1px dashed var(--border-color)' : 'none',
                  marginBottom: col === 'Other' ? '0.35rem' : '0',
                  background: 'transparent',
                  transition: 'background var(--transition-fast)'
                }}
                onMouseEnter={(e) => { e.target.style.background = '#f1f5f9'; }}
                onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
              >
                {col}
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
          <label htmlFor="customCollegeName">Specify College Name <span className="required">*</span></label>
          <div className="input-wrapper">
            <svg className="input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
            </svg>
            <input
              id="customCollegeName"
              type="text"
              placeholder="Enter your college / institute name"
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

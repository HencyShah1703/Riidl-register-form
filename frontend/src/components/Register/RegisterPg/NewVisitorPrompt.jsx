import React from 'react';

// Renders the navigation prompt for first-time visitors who need to register
export default function NewVisitorPrompt({ onSelectNewVisitor }) {
  return (
    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', textAlign: 'center', width: '100%' }}>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
        Visiting Riidl for the first time?
      </p>
      <button 
        type="button" 
        className="btn-secondary" 
        style={{ width: '100%', padding: '0.85rem' }} 
        onClick={onSelectNewVisitor}
      >
        New Visitor
      </button>
    </div>
  );
}

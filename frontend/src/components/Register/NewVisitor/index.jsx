import React, { useState, useEffect } from 'react';
import NewVisitorHeader from './NewVisitorHeader.jsx';
import NewVisitorFormFields from './NewVisitorFormFields.jsx';
import NewVisitorSubmitButton from './NewVisitorSubmitButton.jsx';

const STANDARD_PURPOSES = [
  'To Meet Someone',
  'Internship',
  'For Program/Event',
  'For Training / Workshop / Research',
  'For Facility Tour',
  'For Research Meetup',
  'For using the instrument'
];

// Handles new visitor registration form render
export default function NewVisitor({ formData, onChange, onSubmit, onBack, isLoading }) {
  const [isOtherPurpose, setIsOtherPurpose] = useState(false);
  const [customPurpose, setCustomPurpose] = useState('');

  // Keep local custom purpose state in sync with parent formData
  useEffect(() => {
    const val = formData.purposeOfVisit || '';
    if (val) {
      if (!STANDARD_PURPOSES.includes(val)) {
        setIsOtherPurpose(true);
        setCustomPurpose(val);
      } else {
        setIsOtherPurpose(false);
        setCustomPurpose('');
      }
    }
  }, [formData.purposeOfVisit]);

  return (
    <form className="attendance-form" onSubmit={onSubmit}>
      <NewVisitorHeader onBack={onBack} isLoading={isLoading} />
      <NewVisitorFormFields
        formData={formData}
        onChange={onChange}
        isLoading={isLoading}
        isOtherPurpose={isOtherPurpose}
        setIsOtherPurpose={setIsOtherPurpose}
        customPurpose={customPurpose}
        setCustomPurpose={setCustomPurpose}
      />
      <NewVisitorSubmitButton isLoading={isLoading} />
    </form>
  );
}

import React, { useState, useEffect } from 'react';
import VerifyHeader from './VerifyHeader.jsx';
import VerifyFormFields from './VerifyFormFields.jsx';
import VerifySubmitButton from './VerifySubmitButton.jsx';

const STANDARD_PURPOSES = [
  'To Meet Someone',
  'For Program/Event',
  'For Training / Workshop / Research',
  'For Facility Tour',
  'For Research Meetup',
  'For using the instrument'
];

// Verify details screen for existing registered visitors
export default function VerfiyDetailsOfExistingUser({ formData, onChange, onSubmit, onCancel, isLoading }) {
  const [isOtherPurpose, setIsOtherPurpose] = useState(false);
  const [customPurpose, setCustomPurpose] = useState('');

  // Synchronize custom purpose state with parent formData
  useEffect(() => {
    const val = formData.purposeOfVisit || '';
    if (val && !STANDARD_PURPOSES.includes(val)) {
      setIsOtherPurpose(true);
      setCustomPurpose(val);
    } else {
      setIsOtherPurpose(false);
      setCustomPurpose('');
    }
  }, [formData.purposeOfVisit]);

  return (
    <form className="attendance-form" onSubmit={onSubmit}>
      <VerifyHeader onCancel={onCancel} isLoading={isLoading} />
      <VerifyFormFields
        formData={formData}
        onChange={onChange}
        isLoading={isLoading}
        isOtherPurpose={isOtherPurpose}
        setIsOtherPurpose={setIsOtherPurpose}
        customPurpose={customPurpose}
        setCustomPurpose={setCustomPurpose}
      />
      <VerifySubmitButton isLoading={isLoading} />
    </form>
  );
}

import React, { useState } from 'react';
import VerifyEditForm from './VerifyEditForm.jsx';
import SuccessReceipt from './SuccessReceipt.jsx';

export default function RegisteredUser({ onBack, prefilledUser }) {
  const [step, setStep] = useState('verify'); // 'verify', 'success'
  const [formData, setFormData] = useState({
    name: prefilledUser ? prefilledUser.name : '',
    email: prefilledUser ? prefilledUser.email : '',
    phoneNumber: prefilledUser ? prefilledUser.phoneNumber : '',
    collegeName: prefilledUser ? prefilledUser.collegeName : '',
    iAm: prefilledUser ? prefilledUser.iAm : '',
    purposeOfVisit: '',
    location: 'Riidl HQ'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createdRecord, setCreatedRecord] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (error) setError(null);
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/visitors/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong while check-in');
      }

      setCreatedRecord(data.attendance);
      setStep('success');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phoneNumber: '',
      collegeName: '',
      iAm: '',
      purposeOfVisit: '',
      location: 'Riidl HQ'
    });
    setCreatedRecord(null);
    onBack();
  };

  return (
    <div className="terminal-card glass-panel animate-fade-in">
      {error && <div className="error-alert">{error}</div>}

      {step === 'verify' && (
        <VerifyEditForm
          formData={formData}
          onChange={handleInputChange}
          onSubmit={handleVerifySubmit}
          onCancel={onBack}
          isLoading={isLoading}
        />
      )}

      {step === 'success' && (
        <SuccessReceipt
          record={createdRecord}
          onReset={handleReset}
        />
      )}
    </div>
  );
}

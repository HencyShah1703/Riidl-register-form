import React, { useState, useEffect } from 'react';
import RegisterPg from './RegisterPg/index.jsx';
import VerfiyDetailsOfExistingUser from './VerfiyDetailsOfExistingUser/index.jsx';
import NewVisitor from './NewVisitor/index.jsx';
import AttendaceRecorded from './AttendaceRecorded/index.jsx';

// Coordinates returning lookup, detailed verification, new visitor entry, and success state
export default function Register({ currentPage, setCurrentPage }) {
  const [step, setStep] = useState('welcome'); // 'welcome', 'verify', 'new-visitor', 'success'
  const [isNewVisitorCheckin, setIsNewVisitorCheckin] = useState(false);
  const [createdRecord, setCreatedRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    collegeName: '',
    iAm: '',
    purposeOfVisit: '',
    location: '',
    mentorName: '',
    personToMeet: ''
  });

  // Sync state if navigation changes externally (e.g. Navbar clicks)
  useEffect(() => {
    if (currentPage === 'main') {
      setStep('welcome');
      setCreatedRecord(null);
      setError(null);
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        collegeName: '',
        iAm: '',
        purposeOfVisit: '',
        location: '',
        mentorName: '',
        personToMeet: ''
      });
    }
  }, [currentPage]);

  const handleUserFound = (user) => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      collegeName: user.collegeName || '',
      iAm: user.iAm || '',
      purposeOfVisit: '',
      location: '',
      mentorName: '',
      personToMeet: ''
    });
    setIsNewVisitorCheckin(false);
    setStep('verify');
    setCurrentPage('registered-user');
  };

  const handleSelectFlow = (flow) => {
    if (flow === 'new') {
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        collegeName: '',
        iAm: '',
        purposeOfVisit: '',
        location: '',
        mentorName: '',
        personToMeet: ''
      });
      setIsNewVisitorCheckin(true);
      setStep('new-visitor');
      setCurrentPage('new-user');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (error) setError(null);
  };

  const handleCheckinSubmit = async (e) => {
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
        throw new Error(data.message || 'Something went wrong during check-in');
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
      location: '',
      mentorName: '',
      personToMeet: ''
    });
    setCreatedRecord(null);
    setStep('welcome');
    setCurrentPage('main');
  };

  return (
    <div className="register-flow-container">
      {error && <div className="terminal-card glass-panel error-alert">{error}</div>}

      {step === 'welcome' && (
        <RegisterPg onSelectFlow={handleSelectFlow} onUserFound={handleUserFound} />
      )}

      {step === 'verify' && (
        <div className="terminal-card glass-panel animate-fade-in wide-form-card">
          <VerfiyDetailsOfExistingUser
            formData={formData}
            onChange={handleInputChange}
            onSubmit={handleCheckinSubmit}
            onCancel={handleReset}
            isLoading={isLoading}
          />
        </div>
      )}

      {step === 'new-visitor' && (
        <div className="terminal-card glass-panel animate-fade-in wide-form-card">
          <NewVisitor
            formData={formData}
            onChange={handleInputChange}
            onSubmit={handleCheckinSubmit}
            onBack={handleReset}
            isLoading={isLoading}
          />
        </div>
      )}

      {step === 'success' && (
        <div className="terminal-card glass-panel animate-fade-in">
          <AttendaceRecorded
            record={createdRecord}
            onReset={handleReset}
            isNewVisitor={isNewVisitorCheckin}
          />
        </div>
      )}
    </div>
  );
}

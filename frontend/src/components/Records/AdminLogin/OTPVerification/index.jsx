import React from 'react';
import OTPHeader from './OTPHeader.jsx';
import OTPForm from './OTPForm.jsx';

// Verifies admin access by accepting the 6-digit OTP code
export default function OTPVerification({
  email,
  otpInput,
  setOtpInput,
  isLoading,
  onSubmit,
  onChangeEmail,
  onResendOtp
}) {
  return (
    <>
      <OTPHeader email={email} />
      <OTPForm
        otpInput={otpInput}
        setOtpInput={setOtpInput}
        isLoading={isLoading}
        onSubmit={onSubmit}
        onChangeEmail={onChangeEmail}
        onResendOtp={onResendOtp}
      />
    </>
  );
}

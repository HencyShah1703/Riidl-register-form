import React from 'react';
import riidlLogo from '../../assets/riidl_logo.png';

export default function Header() {
  return (
    <div className="text-center mb-8 flex flex-col items-center font-body">
      <div className="flex flex-col items-center justify-center my-2 text-center w-full">
        <img src={riidlLogo} alt="RIIDL Logo" className="h-14 w-auto object-contain mb-2" />
        <div className="font-title font-bold text-gray-900 text-[1.1rem] tracking-tight">Welcome to Riidl</div>
        <div className="font-body text-gray-500 text-xs mt-0.5">A place to build your startup</div>
      </div>
      
      <p className="text-gray-600 text-sm font-medium mt-3">
        Welcome! Please record your visit.
      </p>
    </div>
  );
}

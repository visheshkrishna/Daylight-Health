'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { PatientData, CSVParseError } from '@/types';

// Use dynamic imports to avoid SSR issues with browser-only components
const CSVUpload = dynamic(() => import('@/components/CSVUpload'), { ssr: false });
const EditableTable = dynamic(() => import('@/components/EdittableTable'), { ssr: false });

export default function Home() {
  const [patientData, setPatientData] = useState<PatientData[]>([]);
  const [error, setError] = useState<CSVParseError | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check initial status
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleDataParsed = (data: PatientData[]) => {
    setPatientData(data);
    setIsDataLoaded(true);
    setError(null);
  };

  const handleError = (error: CSVParseError) => {
    setError(error);
  };
  
  const handleDataChange = (newData: PatientData[]) => {
    setPatientData(newData);
  };

  const handlePrepareForSync = () => {
    setIsSyncing(true);
    // Simulate API call preparation
    setTimeout(() => {
      console.log('Data ready for CRM sync:', patientData);
      alert('Data prepared for CRM sync!');
      setIsSyncing(false);
    }, 1000);
  };
  
  return (    
    <div className="bg-gray-50 min-h-screen">
      <main className='flex min-h-screen flex-col items-center p-8'> 
        <div className='w-full max-w-6xl'>
          <h1 className='font-bold text-3xl text-center mb-8 text-blue-800'>
            Patient Data Manager
          </h1>
          
          {/* Network status warning */}
          {!isOnline && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md shadow-sm">
              <p className="text-yellow-800 font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                You appear to be offline. Some features may be limited.
              </p>
            </div>
          )}
          
          {!isDataLoaded && (
            <div className='p-6 bg-white rounded-lg shadow-md mb-8'>
              <h2 className='text-xl font-semibold mb-4 text-gray-800'>Upload Patient Data</h2>
              <CSVUpload onDataParsed={handleDataParsed} onError={handleError}/>
              {error && (
                <div className='mt-4 p-4 bg-red-50 border border-red-200 rounded-md'>
                  <h3 className='text-red-800 font-medium flex items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error.message}
                  </h3>
                  {error?.details && 
                    <p className='text-red-600 text-sm mt-1 ml-7'>{error.details}</p>
                  }
                </div>
              )}
            </div>
          )}
       
          {isDataLoaded && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Patient Data</h2>
                <button 
                  onClick={() => setIsDataLoaded(false)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  Upload New File
                </button>
              </div>
              <EditableTable data={patientData} onDataChange={handleDataChange} />
              <div className="mt-6 flex justify-end">
                <button 
                  className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 flex items-center ${isSyncing ? 'opacity-75 cursor-not-allowed' : ''}`}
                  onClick={handlePrepareForSync}
                  disabled={isSyncing}
                >
                  {isSyncing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Preparing...
                    </>
                  ) : (
                    <>Prepare for CRM Sync</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { PatientData, CSVParseError } from '@/types';

const CSVUpload = dynamic(() => import('@/components/CSVUpload'), { ssr: false });
const EditableTable = dynamic(() => import('@/components/EdittableTable'), { ssr: false });

export default function Home() {
  const [patientData, setPatientData] = useState<PatientData[]>([]);
  const [error, setError] = useState<CSVParseError | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
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
    setTimeout(() => {
      console.log('Data ready for CRM sync:', patientData);
      alert('Data prepared for CRM sync!');
      setIsSyncing(false);
    }, 1000);
  };

  try {
    return (
      <div className="bg-gray-50 min-h-screen">
        <main className='flex min-h-screen flex-col items-center p-8'> 
          <div className='w-full max-w-6xl'>
            <h1 className='font-bold text-3xl text-center mb-8 text-blue-800'>
              Patient Data Manager
            </h1>

            {!isOnline && (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md shadow-sm">
                <p className="text-yellow-800 font-medium flex items-center">
                  ⚠️ You appear to be offline. Some features may be limited.
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
                      ❌ {error.message}
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
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Upload New File
                  </button>
                </div>
                <EditableTable data={patientData} onDataChange={handleDataChange} />
                <div className="mt-6 flex justify-end">
                  <button 
                    className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center ${isSyncing ? 'opacity-75 cursor-not-allowed' : ''}`}
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
  } catch (err: any) {
    console.error('💥 Error rendering Home page:', err);
    return (
      <div className="p-10 text-center text-red-600 font-bold">
        Something went wrong while rendering the page.
      </div>
    );
  }
}

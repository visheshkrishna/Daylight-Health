'use client';

import React, { useState } from 'react';
import CSVUpload from '@/components/CSVUpload';
import EditableTable from '@/components/EdittableTable';
import { PatientData, CSVParseError } from '@/types';

export default function Home() {
const [patientData, setPatientData] = useState<PatientData[]>([])
const [error, setError] = useState<CSVParseError | null>(null);
const [isDataLoaded, setIsDataLoaded] = useState(false);
const handleDataParsed = (data: PatientData[]) => {
    setPatientData(data);
    setIsDataLoaded(true);
    setError(null);
  };

  const handleError = (error: CSVParseError) => {
    setError(error)
  }
  const handleDataChange = (newData: PatientData[]) => {
    setPatientData(newData);
  }
  return (    
    <div>
      <main className='flex min-h-screen flex-col items-center p-8'> 
        <div className='w-full max-w-6xl'>
          <h1 className='font-bold text-3xl text-center mb-8'>
            Patient Data Manager
          </h1>
          {!isDataLoaded && (
          <div className='p-6 rounded-lg shadow-md mb-8'>
            <h2 className='text-xl font-semibold mb-4'>Upload patient data </h2>
            <CSVUpload onDataParsed={handleDataParsed} onError={handleError}/>
            {error && (
              <div className='mt-4 p-4 bg-red-50 border border-red-200 rounded-md'>
                <h3 className='text-red-800 font-medium'>{error.message}</h3>
                {error?.details && 
                  <p className='text-red-600 text-sm mt-1'> {error.details} </p>
                }
              </div>
            )}
          </div>
          )}
       </div>

          {isDataLoaded && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Patient Data</h2>
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
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                onClick={() => {
                  // This is where we would prepare data for CRM sync
                  console.log('Data ready for CRM sync:', patientData);
                  alert('Data prepared for CRM sync!');
                }}
              >
                Prepare for CRM Sync
              </button>
            </div>
            </div>
          )}
      </main>
    </div>
  );
}
'use client';

import React, {useCallback, useState} from "react";
import Papa from "papaparse";
import { CSVParseError, PatientData } from "../types";
import { useDropzone } from "react-dropzone";

interface CSVUploadProps {
    onDataParsed: (data: PatientData[])=> void;
    onError: (error:CSVParseError)=> void;
}

const CSVUpload: React.FC<CSVUploadProps> = ({ onDataParsed, onError }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isDragActive, setIsDragActive] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) {
            onError({
                type: 'validation',
                message: 'No file selected',
                details: 'Please select a CSV file to upload'
            });
            return;
        }

        const file = acceptedFiles[0];
        
        // Check file type
        if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
            onError({
                type: 'validation',
                message: 'Invalid file type',
                details: 'Please upload a CSV file'
            });
            return;
        }

        setIsLoading(true);

        // Add timeout to handle network issues
        const timeoutId = setTimeout(() => {
            setIsLoading(false);
            onError({
                type: 'network',
                message: 'Request timeout',
                details: 'The file processing took too long. Please try again.'
            });
        }, 30000); // 30 second timeout

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                clearTimeout(timeoutId);
                setIsLoading(false);

                if (results.errors.length > 0) {
                    onError({
                        type: 'parse',
                        message: 'Error parsing the CSV file',
                        details: results.errors[0].message
                    });
                    return;
                }

                // Check for empty file
                if (results.data.length === 0) {
                    onError({
                        type: 'validation',
                        message: 'Empty CSV file',
                        details: 'The uploaded file does not contain any data rows'
                    });
                    return;
                }

                // Validate required columns - Fix the TypeScript error here
                const requiredColumns = ['EHR ID', 'Patient Name', 'Email', 'Phone', 'Referring Provider'];
                
                // Type assertion to tell TypeScript that results.data[0] is a Record<string, unknown>
                const firstRow = results.data[0] as Record<string, unknown>;
                const headers = Object.keys(firstRow);
                
                const missingColumns = requiredColumns.filter(col => !headers.includes(col));

                if (missingColumns.length > 0) {
                    onError({
                        type: 'validation',
                        message: 'Missing required columns',
                        details: `The following columns are missing: ${missingColumns.join(', ')}`
                    });
                    return;
                }

                // Map data to our expected format
                const mappedData = results.data.map((row: unknown) => {
                    const csvRow = row as Record<string, string>;
                    return {
                        ehrId: csvRow['EHR ID'] || "",
                        patientName: csvRow['Patient Name'] || '',
                        email: csvRow['Email'] || '',
                        phone: csvRow['Phone'] || '',
                        referringProvider: csvRow['Referring Provider'] || '',
                        ...csvRow
                    };
                });
                
                onDataParsed(mappedData as PatientData[]);
            },
            error: (error) => {
                clearTimeout(timeoutId);
                setIsLoading(false);
                onError({
                    type: 'parse',
                    message: 'Error parsing the CSV file',
                    details: error.message
                });
            }
        });
    }, [onDataParsed, onError]);

    const { getRootProps, getInputProps, isDragActive: dropzoneIsDragActive } = useDropzone({ 
        onDrop,
        accept: {
            'text/csv': ['.csv']
        }
    });

    // Update drag state for UI feedback
    React.useEffect(() => {
        setIsDragActive(dropzoneIsDragActive);
    }, [dropzoneIsDragActive]);

    return (
        <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}>
            <input {...getInputProps()} />

            {isLoading ? (
                <div className='py-4'>
                    <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">Processing file...</p>
                </div>
            ) : isDragActive ? (
                <p className='text-blue-500 font-medium'>Drop the CSV file here...</p>
            ) : (
                <div>
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">Drag and drop a CSV file here, or click to select a file</p>
                    <p className="mt-1 text-xs text-gray-500">File should include: EHR ID, Patient Name, Email, Phone, Referring Provider</p>
                </div>
            )}
        </div>
    );
};

export default CSVUpload;
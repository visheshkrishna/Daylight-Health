import React, {useCallback, useState} from "react";
import Papa from "papaparse";
import { CSVParseError, PatientData } from "../types";
import  { useDropzone }from "react-dropzone";

interface CSVUploadProps {
    onDataParsed: (data: PatientData[])=> void;
    onError: (error:CSVParseError)=> void;
}

const CSVUpload : React.FC<CSVUploadProps> = ({onDataParsed, onError}) => {
    const [isLoading, setIsLoading] = useState(false);

    const onDrop = useCallback((acceptedFile: File[]) => {
        const file = acceptedFile[0];
        if(!file) return;
        setIsLoading(true);

        if (!file.name.endsWith('.csv')) {
            onError({
                type: 'validation',
                message: 'Invalid file format',
                details: 'Please upload a file type of CSV'
            })
            setIsLoading(false);
            return;
        }

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                setIsLoading(false);

                if(results.errors.length > 0) {
                    onError({
                        type: 'parse',
                        message: 'Error paring the CSV file',
                        details: results.errors[0].message
                })
                return;
                }

                const mappedData = results.data.map((row: any) => ({
                    ehrId: row['EHR ID'] || "",
                    patientName: row['Patient Name'] || '',
                    email: row['Email'] || '',
                    phone: row['Phone'] || '',
                    referringProvider: row['Referring Provider'] || '',
                    ...row
                }));
                onDataParsed(mappedData as PatientData[]) ;   
            },
            error:(error) => {
                setIsLoading(false);
                onError({
                    type: 'parse',
                    message: 'Error parsing the CSV file',
                    details: error.message
                })
            }
        })
    }, [onDataParsed, onError])

    
    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv']
        },
        maxFiles: 1
    })

    return (
        <div
            {...getRootProps()}
            className={`${isDragActive ? 'border-blue-500' : 'border-gray-300'}`}>
            <input {...getInputProps()} />

            {isLoading ? (
                <div className='py-4'>
                    <p className='Processing file..'></p>
                </div>
                ): isDragActive ? (
                    <p className='text-blue-500'> Drop the CSV file here</p>
                ) : (
                    <div>
                        <p className='text-fray-600'> Drag and drop a csv file here, or click to upload a file</p>
                    </div>
                )}
            
        </div>
    )
}

export default CSVUpload
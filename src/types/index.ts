export interface PatientData {
    ehrId: string;
    patientName: string;
    email: string;
    phone: string;
    referringProvider: string;
}

export interface CSVParseError{
    type: 'parse' | 'validation' | 'network';
    message: string;
    details?: string;
}
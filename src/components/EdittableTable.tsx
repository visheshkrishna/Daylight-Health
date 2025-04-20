import React, { useState, useEffect } from 'react';
import { PatientData } from '@/types';

interface EditableTableProps {
  data: PatientData[];
  onDataChange?: (data: PatientData[]) => void;
}

const EditableTable: React.FC<EditableTableProps> = ({ data, onDataChange }) => {
  const [tableData, setTableData] = useState<PatientData[]>([]);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const handleChange = (index: number, field: keyof PatientData, value: string) => {
    const newData = [...tableData];
    newData[index] = {
      ...newData[index],
      [field]: value,
    };
    setTableData(newData);
    onDataChange?.(newData);
  };

  if (tableData.length === 0) {
    return <div className="text-center py-4">No data available</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EHR ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referring Provider</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="text"
                  value={row.ehrId || ''}
                  onChange={(e) => handleChange(rowIndex, 'ehrId', e.target.value)}
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="text"
                  value={row.patientName || ''}
                  onChange={(e) => handleChange(rowIndex, 'patientName', e.target.value)}
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="text"
                  value={row.email || ''}
                  onChange={(e) => handleChange(rowIndex, 'email', e.target.value)}
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="text"
                  value={row.phone || ''}
                  onChange={(e) => handleChange(rowIndex, 'phone', e.target.value)}
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="text"
                  value={row.referringProvider || ''}
                  onChange={(e) => handleChange(rowIndex, 'referringProvider', e.target.value)}
                  className="w-full p-1 border rounded"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EditableTable;
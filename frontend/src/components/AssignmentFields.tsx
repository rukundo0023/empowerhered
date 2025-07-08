import React from 'react';

export type AssignmentFieldsData = {
  instructions: string;
  dueDate: string;
  fileType: string;
  fileUrl: string;
};
// ESM import workaround: export a dummy variable
export const AssignmentFieldsData = null;

interface AssignmentFieldsProps {
  value: AssignmentFieldsData;
  onChange: (value: AssignmentFieldsData) => void;
}

const AssignmentFields: React.FC<AssignmentFieldsProps> = ({ value, onChange }) => {
  return (
    <div className="bg-gray-50 p-2 rounded mb-2">
      <label className="block font-semibold mb-1">Assignment (optional)</label>
      <input
        type="text"
        placeholder="Assignment Instructions"
        value={value.instructions}
        onChange={e => onChange({ ...value, instructions: e.target.value })}
        className="border rounded px-2 py-1 mb-1 w-full"
      />
      <input
        type="date"
        placeholder="Due Date"
        value={value.dueDate}
        onChange={e => onChange({ ...value, dueDate: e.target.value })}
        className="border rounded px-2 py-1 mb-1 w-full"
      />
      <input
        type="text"
        placeholder="File Type (e.g. application/pdf)"
        value={value.fileType}
        onChange={e => onChange({ ...value, fileType: e.target.value })}
        className="border rounded px-2 py-1 mb-1 w-full"
      />
      <input
        type="text"
        placeholder="File URL (optional)"
        value={value.fileUrl}
        onChange={e => onChange({ ...value, fileUrl: e.target.value })}
        className="border rounded px-2 py-1 mb-1 w-full"
      />
    </div>
  );
};

export default AssignmentFields; 
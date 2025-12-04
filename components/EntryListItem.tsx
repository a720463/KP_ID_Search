import React from 'react';
import { Entry } from '../types';
import { Timestamp } from 'firebase/firestore'; // Import Timestamp

interface EntryListItemProps {
  entry: Entry;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

// Helper function to format Firebase Timestamp
const formatTimestamp = (timestamp: Timestamp | undefined): string => {
  if (!timestamp) {
    return 'N/A';
  }
  const date = timestamp.toDate();
  // Using toLocaleString for a user-friendly local date and time format
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false // Use 24-hour format
  });
};

const EntryListItem: React.FC<EntryListItemProps> = ({ entry, onEdit, onDelete }) => {
  // Prefer updatedAt, fallback to createdAt for display
  const displayTime = entry.updatedAt || entry.createdAt;

  return (
    <tr className="bg-white border-b border-gray-200 hover:bg-gray-50">
      <td className="py-3 px-4 text-gray-800">{entry.lineName}</td>
      <td className="py-3 px-4 text-gray-800">{entry.gameId}</td>
      <td className="py-3 px-4 text-gray-800 text-sm">{formatTimestamp(displayTime)}</td> {/* New column for time */}
      <td className="py-3 px-4 text-right">
        <button
          onClick={() => onEdit(entry.id)}
          className="mr-2 px-3 py-1 text-sm rounded-md font-medium text-white bg-blue-500 hover:bg-blue-600 transition duration-200"
        >
          編輯
        </button>
        <button
          onClick={() => onDelete(entry.id)}
          className="px-3 py-1 text-sm rounded-md font-medium text-white bg-red-500 hover:bg-red-600 transition duration-200"
        >
          刪除
        </button>
      </td>
    </tr>
  );
};

export default EntryListItem;
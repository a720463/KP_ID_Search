import React from 'react';
import { Entry } from '../types';
import EntryListItem from './EntryListItem';

interface EntryListProps {
  entries: Entry[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const EntryList: React.FC<EntryListProps> = ({ entries, onEdit, onDelete }) => {
  if (entries.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 text-center text-gray-500">
        目前沒有申報資料。請新增第一個成員！
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <h2 className="text-xl font-semibold p-6 text-indigo-800 border-b border-gray-200">
        KP 車隊成員列表
      </h2>
      <table className="w-full text-left table-auto border-collapse">
        <thead className="bg-indigo-100 text-indigo-800 uppercase text-sm font-semibold">
          <tr>
            <th className="py-3 px-4">Line 名字</th>
            <th className="py-3 px-4">遊戲 ID</th>
            <th className="py-3 px-4">加入/修改 時間</th> {/* New table header */}
            <th className="py-3 px-4 text-right">操作</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <EntryListItem key={entry.id} entry={entry} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EntryList;
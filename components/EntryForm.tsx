

import React, { useState, useEffect, useCallback } from 'react';
import { Entry, EntryFormData } from '../types';

interface EntryFormProps {
  // Fix: onSave now accepts EntryFormData and an optional ID for editing, aligning with how data is generated and consumed.
  onSave: (formData: EntryFormData, id?: string) => void;
  editingEntry: Entry | null;
  onCancelEdit: () => void;
}

const EntryForm: React.FC<EntryFormProps> = ({ onSave, editingEntry, onCancelEdit }) => {
  const [lineName, setLineName] = useState('');
  const [gameId, setGameId] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (editingEntry) {
      setLineName(editingEntry.lineName);
      setGameId(editingEntry.gameId);
    } else {
      setLineName('');
      setGameId('');
    }
  }, [editingEntry]);

  useEffect(() => {
    setIsFormValid(lineName.trim() !== '' && gameId.trim() !== '');
  }, [lineName, gameId]);

  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    if (!isFormValid) {
      return;
    }

    // Fix: Create EntryFormData object with only the fields the form directly provides.
    const formData: EntryFormData = {
      lineName: lineName.trim(),
      gameId: gameId.trim(),
    };
    // Fix: Pass formData and the ID of the entry being edited (if applicable) to onSave.
    onSave(formData, editingEntry?.id);
    setLineName('');
    setGameId('');
  }, [lineName, gameId, editingEntry, onSave, isFormValid]);

  const handleCancel = useCallback(() => {
    onCancelEdit();
    setLineName('');
    setGameId('');
  }, [onCancelEdit]);

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4 text-indigo-800">
        {editingEntry ? '編輯車隊成員資料' : '新增車隊成員資料'}
      </h2>
      <div className="mb-4">
        <label htmlFor="lineName" className="block text-gray-700 text-sm font-bold mb-2">
          Line 名字:
        </label>
        <input
          type="text"
          id="lineName"
          value={lineName}
          onChange={(e) => setLineName(e.target.value)}
          placeholder="輸入 Line 名字"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>
      <div className="mb-6">
        <label htmlFor="gameId" className="block text-gray-700 text-sm font-bold mb-2">
          遊戲 ID:
        </label>
        <input
          type="text"
          id="gameId"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
          placeholder="輸入遊戲 ID"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>
      <div className="flex justify-end space-x-4">
        {editingEntry && (
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 rounded-md font-semibold text-white bg-gray-400 hover:bg-gray-500 transition duration-200"
          >
            取消編輯
          </button>
        )}
        <button
          type="submit"
          disabled={!isFormValid}
          className={`px-4 py-2 rounded-md font-semibold text-white transition duration-200 ${
            isFormValid ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-300 cursor-not-allowed'
          }`}
        >
          {editingEntry ? '更新資料' : '申報 ID'}
        </button>
      </div>
    </form>
  );
};

export default EntryForm;
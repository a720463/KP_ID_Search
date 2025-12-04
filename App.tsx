
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Entry, EntryFormData } from './types'; // Import EntryFormData
import { subscribeToEntries, addEntry, updateEntry, deleteEntry } from './services/firebaseService'; // Import Firebase service
import EntryForm from './components/EntryForm';
import EntryList from './components/EntryList';

function App() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // New loading state
  const [searchTerm, setSearchTerm] = useState<string>(''); // New search term state

  // Subscribe to Firebase entries on initial mount
  useEffect(() => {
    const unsubscribe = subscribeToEntries((fetchedEntries) => {
      setEntries(fetchedEntries);
      setLoading(false); // Data loaded, set loading to false
    });

    // Clean up the subscription on component unmount
    return () => unsubscribe();
  }, []);

  // Fix: Adjusted handleSaveEntry to accept EntryFormData and an optional ID
  const handleSaveEntry = useCallback(async (formData: EntryFormData, id?: string) => {
    try {
      if (id) {
        // This is an update operation
        // Find the existing entry to preserve its 'createdAt' timestamp
        const existingEntry = entries.find(entry => entry.id === id);
        if (existingEntry) {
          await updateEntry({
            ...existingEntry, // Keep existing id and createdAt
            lineName: formData.lineName,
            gameId: formData.gameId,
          });
          setEditingEntry(null); // Clear editing state after update
        } else {
          console.error(`Attempted to update entry with ID ${id} but it was not found.`);
        }
      } else {
        // This is an add operation
        // addEntry expects Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>,
        // which matches EntryFormData perfectly for the relevant fields.
        await addEntry(formData);
      }
    } catch (error) {
      console.error("Failed to save entry:", error);
      // Optionally show an error message to the user
    }
  }, [entries]); // Dependency on 'entries' is needed to find 'existingEntry' for updates

  const handleEditEntry = useCallback((id: string) => {
    const entryToEdit = entries.find(entry => entry.id === id);
    if (entryToEdit) {
      setEditingEntry(entryToEdit);
    }
  }, [entries]);

  const handleDeleteEntry = useCallback(async (id: string) => {
    // eslint-disable-next-line no-alert
    if (window.confirm('確定要刪除這筆資料嗎？')) {
      try {
        await deleteEntry(id); // Delete from Firebase
        if (editingEntry?.id === id) {
          setEditingEntry(null); // Clear editing state if the deleted entry was being edited
        }
      } catch (error) {
        console.error("Failed to delete entry:", error);
        // Optionally show an error message to the user
      }
    }
  }, [editingEntry]);

  const handleCancelEdit = useCallback(() => {
    setEditingEntry(null);
  }, []);

  // Filter entries based on search term
  const filteredEntries = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return entries.filter(entry =>
      entry.lineName.toLowerCase().includes(lowerCaseSearchTerm) ||
      entry.gameId.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [entries, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-8 text-indigo-700">
          KP 車隊 ID 申報處
        </h1>

        <EntryForm onSave={handleSaveEntry} editingEntry={editingEntry} onCancelEdit={handleCancelEdit} />

        <div className="mb-6">
          <input
            type="text"
            placeholder="搜尋 Line 名字或遊戲 ID..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="搜尋 Line 名字或遊戲 ID"
          />
        </div>

        {loading ? (
          <div className="text-center text-gray-600 text-lg font-medium mt-8">載入中...</div>
        ) : (
          <EntryList entries={filteredEntries} onEdit={handleEditEntry} onDelete={handleDeleteEntry} />
        )}
      </div>
    </div>
  );
}

export default App;
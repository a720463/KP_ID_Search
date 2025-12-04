import { db } from '../firebaseConfig';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy, Timestamp } from 'firebase/firestore';
import { Entry } from '../types';

const COLLECTION_NAME = 'kpRacingTeamEntries'; // Firestore collection name

/**
 * Sets up a real-time listener for entries in Firestore.
 * @param {function(Entry[]): void} callback - A callback function that receives the updated list of entries.
 * @returns {function(): void} An unsubscribe function to stop listening to updates.
 */
export const subscribeToEntries = (callback: (entries: Entry[]) => void) => {
  // Order by createdAt to ensure consistent display order, new entries appear at the bottom
  const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'asc')); 
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const entries: Entry[] = snapshot.docs.map(d => {
        const data = d.data();
        return {
            id: d.id,
            lineName: data.lineName,
            gameId: data.gameId,
            createdAt: data.createdAt as Timestamp, // Firebase returns Timestamp directly
            updatedAt: data.updatedAt as Timestamp | undefined, // Firebase returns Timestamp directly, might be undefined
        } as Entry;
    });
    callback(entries);
  }, (error) => {
    console.error("Error subscribing to entries:", error);
    // Optionally handle error state in the UI
  });

  return unsubscribe;
};

/**
 * Adds a new entry to Firestore.
 * @param {Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>} entry - The entry data without an ID or timestamps.
 */
export const addEntry = async (entry: Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...entry,
      createdAt: Timestamp.now(), // Set creation timestamp
    });
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

/**
 * Updates an existing entry in Firestore.
 * @param {Entry} entry - The complete entry object, including its ID.
 */
export const updateEntry = async (entry: Entry): Promise<void> => {
  try {
    const entryRef = doc(db, COLLECTION_NAME, entry.id);
    await updateDoc(entryRef, {
      lineName: entry.lineName,
      gameId: entry.gameId,
      updatedAt: Timestamp.now(), // Update modification timestamp
    });
    console.log("Document updated with ID: ", entry.id);
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
};

/**
 * Deletes an entry from Firestore.
 * @param {string} id - The ID of the entry to delete.
 */
export const deleteEntry = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    console.log("Document deleted with ID: ", id);
  } catch (e) {
    console.error("Error deleting document: ", e);
    throw e;
  }
};
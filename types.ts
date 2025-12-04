
import { Timestamp } from 'firebase/firestore';

export interface Entry {
  id: string;
  lineName: string;
  gameId: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp; // Optional, as it might not exist for newly created entries or old ones
}

// Interface for data directly submitted from the EntryForm
export interface EntryFormData {
  lineName: string;
  gameId: string;
}

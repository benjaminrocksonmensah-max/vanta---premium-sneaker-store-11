import { collection, doc, getDocs, setDoc, deleteDoc, query, orderBy, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile } from '../types';

const COLLECTION_NAME = 'users';

export const customerService = {
  async getAll(): Promise<UserProfile[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as UserProfile);
    } catch (error) {
      console.error('Error fetching customers:', error);
      return [];
    }
  },

  async update(id: string, updates: Partial<UserProfile>): Promise<boolean> {
    try {
      await updateDoc(doc(db, COLLECTION_NAME, id), updates);
      return true;
    } catch (error) {
      console.error('Error updating customer:', error);
      return false;
    }
  },
};

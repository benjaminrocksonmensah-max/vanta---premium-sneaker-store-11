import { collection, doc, getDocs, setDoc, deleteDoc, query, orderBy, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Review } from '../types';

const COLLECTION_NAME = 'reviews';

export const reviewService = {
  async getAll(): Promise<Review[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as Review);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  },

  async update(id: string, updates: Partial<Review>): Promise<boolean> {
    try {
      await updateDoc(doc(db, COLLECTION_NAME, id), updates);
      return true;
    } catch (error) {
      console.error('Error updating review:', error);
      return false;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      return true;
    } catch (error) {
      console.error('Error deleting review:', error);
      return false;
    }
  }
};

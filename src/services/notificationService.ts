import { collection, doc, getDocs, setDoc, deleteDoc, query, orderBy, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AppNotification } from '../types';

const COLLECTION_NAME = 'notifications';

export const notificationService = {
  async getAll(): Promise<AppNotification[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as AppNotification);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },

  async create(data: Omit<AppNotification, 'id' | 'date'>): Promise<AppNotification | null> {
    try {
      const id = `notif-${Date.now()}`;
      const item: AppNotification = {
        ...data,
        id,
        date: new Date().toISOString()
      };
      await setDoc(doc(db, COLLECTION_NAME, id), item);
      return item;
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  },

  async update(id: string, updates: Partial<AppNotification>): Promise<boolean> {
    try {
      await updateDoc(doc(db, COLLECTION_NAME, id), updates);
      return true;
    } catch (error) {
      console.error('Error updating notification:', error);
      return false;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }
};

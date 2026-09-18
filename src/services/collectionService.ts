import { collection, doc, getDocs, setDoc, deleteDoc, query, orderBy, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface CollectionData {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  productIds: string[];
  status: 'active' | 'archived' | 'disabled';
  featured: boolean;
  displayOrder: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

const COLLECTION_NAME = 'collections';

export const collectionService = {
  async getAll(): Promise<CollectionData[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('displayOrder', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as CollectionData);
    } catch (error) {
      console.error('Error fetching collections:', error);
      return [];
    }
  },

  async create(data: Omit<CollectionData, 'id' | 'createdAt' | 'updatedAt'>): Promise<CollectionData | null> {
    try {
      const id = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const item: CollectionData = {
        ...data,
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await setDoc(doc(db, COLLECTION_NAME, id), item);
      return item;
    } catch (error) {
      console.error('Error creating collection:', error);
      return null;
    }
  },

  async update(id: string, updates: Partial<CollectionData>): Promise<boolean> {
    try {
      await updateDoc(doc(db, COLLECTION_NAME, id), {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Error updating collection:', error);
      return false;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      return true;
    } catch (error) {
      console.error('Error deleting collection:', error);
      return false;
    }
  }
};

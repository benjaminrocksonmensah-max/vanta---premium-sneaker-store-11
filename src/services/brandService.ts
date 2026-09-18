import { collection, doc, getDocs, setDoc, deleteDoc, query, orderBy, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  status: 'active' | 'archived' | 'disabled';
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

const COLLECTION_NAME = 'brands';

export const brandService = {
  async getAll(): Promise<Brand[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('displayOrder', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as Brand);
    } catch (error) {
      console.error('Error fetching brands:', error);
      return [];
    }
  },

  async create(data: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>): Promise<Brand | null> {
    try {
      const id = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const brand: Brand = {
        ...data,
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await setDoc(doc(db, COLLECTION_NAME, id), brand);
      return brand;
    } catch (error) {
      console.error('Error creating brand:', error);
      return null;
    }
  },

  async update(id: string, updates: Partial<Brand>): Promise<boolean> {
    try {
      await updateDoc(doc(db, COLLECTION_NAME, id), {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Error updating brand:', error);
      return false;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      return true;
    } catch (error) {
      console.error('Error deleting brand:', error);
      return false;
    }
  }
};

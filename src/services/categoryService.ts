import { collection, doc, getDocs, setDoc, deleteDoc, query, orderBy, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  status: 'active' | 'archived' | 'disabled';
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

const COLLECTION_NAME = 'categories';

export const categoryService = {
  async getAll(): Promise<Category[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('displayOrder', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as Category);
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  async create(data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category | null> {
    try {
      const id = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const category: Category = {
        ...data,
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await setDoc(doc(db, COLLECTION_NAME, id), category);
      return category;
    } catch (error) {
      console.error('Error creating category:', error);
      return null;
    }
  },

  async update(id: string, updates: Partial<Category>): Promise<boolean> {
    try {
      await updateDoc(doc(db, COLLECTION_NAME, id), {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Error updating category:', error);
      return false;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    }
  }
};

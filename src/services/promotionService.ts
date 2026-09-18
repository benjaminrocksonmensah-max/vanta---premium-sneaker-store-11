import { collection, doc, getDocs, setDoc, deleteDoc, query, orderBy, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export type DiscountType = 'percentage' | 'fixed';

export interface Promotion {
  id: string;
  name: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  startDate: string;
  endDate: string;
  applicableProducts: string[];
  applicableCategories: string[];
  applicableCollections: string[];
  minOrderValue?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  status: 'active' | 'paused' | 'archived';
  createdAt: string;
  updatedAt: string;
}

const COLLECTION_NAME = 'promotions';

export const promotionService = {
  async getAll(): Promise<Promotion[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as Promotion);
    } catch (error) {
      console.error('Error fetching promotions:', error);
      return [];
    }
  },

  async create(data: Omit<Promotion, 'id' | 'usageCount' | 'createdAt' | 'updatedAt'>): Promise<Promotion | null> {
    try {
      const id = `promo-${Date.now()}`;
      const item: Promotion = {
        ...data,
        id,
        usageCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await setDoc(doc(db, COLLECTION_NAME, id), item);
      return item;
    } catch (error) {
      console.error('Error creating promotion:', error);
      return null;
    }
  },

  async update(id: string, updates: Partial<Promotion>): Promise<boolean> {
    try {
      await updateDoc(doc(db, COLLECTION_NAME, id), {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Error updating promotion:', error);
      return false;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      return true;
    } catch (error) {
      console.error('Error deleting promotion:', error);
      return false;
    }
  }
};

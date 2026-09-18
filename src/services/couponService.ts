import { collection, doc, getDocs, setDoc, deleteDoc, query, orderBy, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DiscountType } from './promotionService';

export interface CouponData {
  id: string;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  perCustomerLimit?: number;
  applicableProducts: string[];
  applicableCategories: string[];
  usageCount: number;
  status: 'active' | 'disabled' | 'archived';
  createdAt: string;
  updatedAt: string;
}

const COLLECTION_NAME = 'coupons';

export const couponService = {
  async getAll(): Promise<CouponData[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as CouponData);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      return [];
    }
  },

  async create(data: Omit<CouponData, 'id' | 'usageCount' | 'createdAt' | 'updatedAt'>): Promise<CouponData | null> {
    try {
      const id = data.code.toUpperCase().replace(/\s+/g, '');
      const item: CouponData = {
        ...data,
        id,
        code: id,
        usageCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await setDoc(doc(db, COLLECTION_NAME, id), item);
      return item;
    } catch (error) {
      console.error('Error creating coupon:', error);
      return null;
    }
  },

  async update(id: string, updates: Partial<CouponData>): Promise<boolean> {
    try {
      await updateDoc(doc(db, COLLECTION_NAME, id), {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Error updating coupon:', error);
      return false;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      return true;
    } catch (error) {
      console.error('Error deleting coupon:', error);
      return false;
    }
  }
};

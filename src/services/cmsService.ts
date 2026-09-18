import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface HeroBanner {
  heading: string;
  subheading: string;
  image: string;
  ctaText: string;
  ctaDestination: string;
  active: boolean;
}

export interface PromoBanner {
  heading: string;
  description: string;
  image: string;
  ctaText: string;
  startDate: string;
  endDate: string;
  active: boolean;
}

export interface HomepageContent {
  hero: HeroBanner;
  promo: PromoBanner;
  featuredProducts: string[]; // Product IDs
  trendingProducts: string[];
  featuredCollections: string[]; // Collection IDs
}

const DOC_ID = 'homepage';
const COLLECTION_NAME = 'cms';

export const cmsService = {
  async getHomepageContent(): Promise<HomepageContent | null> {
    try {
      const snapshot = await getDoc(doc(db, COLLECTION_NAME, DOC_ID));
      if (snapshot.exists()) {
        return snapshot.data() as HomepageContent;
      }
      return null;
    } catch (error) {
      console.error('Error fetching homepage CMS:', error);
      return null;
    }
  },

  async updateHomepageContent(data: HomepageContent): Promise<boolean> {
    try {
      await setDoc(doc(db, COLLECTION_NAME, DOC_ID), data, { merge: true });
      return true;
    } catch (error) {
      console.error('Error updating homepage CMS:', error);
      return false;
    }
  }
};

import { useState, useEffect } from 'react';
import { cmsService, HomepageContent } from '../services/cmsService';

const DEFAULT_CONTENT: HomepageContent = {
  hero: {
    heading: 'STEP INTO WHAT\'S NEXT.',
    subheading: 'Engineered for the fearless.',
    image: '',
    ctaText: 'SHOP NEW ARRIVALS',
    ctaDestination: '/shop',
    active: true
  },
  promo: {
    heading: 'MID-SEASON SALE',
    description: 'Up to 40% off selected styles.',
    image: '',
    ctaText: 'SHOP SALE',
    startDate: '',
    endDate: '',
    active: false
  },
  featuredProducts: [],
  trendingProducts: [],
  featuredCollections: []
};

export const useCMS = () => {
  const [content, setContent] = useState<HomepageContent>(DEFAULT_CONTENT);
  const [isLoading, setIsLoading] = useState(true);

  const loadContent = async () => {
    setIsLoading(true);
    const data = await cmsService.getHomepageContent();
    if (data) {
      setContent(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadContent();
  }, []);

  return { content, isLoading, reloadCMS: loadContent };
};

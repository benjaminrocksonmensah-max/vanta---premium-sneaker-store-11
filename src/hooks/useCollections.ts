import { useState, useEffect } from 'react';
import { collectionService, CollectionData } from '../services/collectionService';

export const useCollections = () => {
  const [collections, setCollections] = useState<CollectionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCollections = async () => {
    setIsLoading(true);
    const data = await collectionService.getAll();
    setCollections(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadCollections();
  }, []);

  return { collections, isLoading, reloadCollections: loadCollections };
};

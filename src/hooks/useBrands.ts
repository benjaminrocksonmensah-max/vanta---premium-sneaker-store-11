import { useState, useEffect } from 'react';
import { brandService, Brand } from '../services/brandService';

export const useBrands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadBrands = async () => {
    setIsLoading(true);
    const data = await brandService.getAll();
    setBrands(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadBrands();
  }, []);

  return { brands, isLoading, reloadBrands: loadBrands };
};

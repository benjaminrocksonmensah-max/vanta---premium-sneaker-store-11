import { useState, useEffect } from 'react';
import { categoryService, Category } from '../services/categoryService';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCategories = async () => {
    setIsLoading(true);
    const data = await categoryService.getAll();
    setCategories(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return { categories, isLoading, reloadCategories: loadCategories };
};

// frontend/src/features/faq/hooks/useFAQ.ts
import { useState, useEffect, useCallback } from 'react';
import { FAQ, FAQCategoria, UseFAQReturn } from '../types/faq.types';
import { FAQService } from '../services/faq.service';

export const useFAQ = (): UseFAQReturn => {  // ⬅️ Agregar tipo de retorno
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [allFaqs, setAllFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<FAQCategoria | 'all'>('all');

  const faqService = new FAQService();

  const fetchFAQs = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await faqService.getAllFAQs();
      setAllFaqs(data);
      setFaqs(data);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Error al cargar las preguntas frecuentes';
      setError(errorMessage);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchFAQs = useCallback(async (query: string) => {
    if (!query || query.trim().length === 0) {
      if (selectedCategory === 'all') {
        setFaqs(allFaqs);
      } else {
        setFaqs(allFaqs.filter(faq => faq.categoria === selectedCategory));
      }
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await faqService.searchFAQs(query);
      
      if (selectedCategory === 'all') {
        setFaqs(data);
      } else {
        setFaqs(data.filter(faq => faq.categoria === selectedCategory));
      }
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Error en la búsqueda';
      setError(errorMessage);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, [allFaqs, selectedCategory]);

  const filterByCategory = useCallback((category: FAQCategoria | 'all') => {
    setSelectedCategory(category);
    
    if (category === 'all') {
      setFaqs(allFaqs);
    } else {
      setFaqs(allFaqs.filter(faq => faq.categoria === category));
    }
  }, [allFaqs]);

  useEffect(() => {
    fetchFAQs();
  }, [fetchFAQs]);

  return {
    faqs,
    loading,
    error,
    selectedCategory,
    searchFAQs,
    fetchFAQs,
    filterByCategory,
  };
};
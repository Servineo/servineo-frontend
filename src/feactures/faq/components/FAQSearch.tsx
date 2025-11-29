// frontend/src/features/faq/components/FAQSearch.tsx
'use client';

import React, { useState, useEffect } from 'react';
import styles from '../styles/faq.module.css';

interface FAQSearchProps {
  onSearch: (query: string) => void;
}

export const FAQSearch: React.FC<FAQSearchProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300); // Debounce de 300ms

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, onSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className={styles.searchContainer}>
      <span className={styles.searchIcon}>🔍</span>
      <input
        type="text"
        placeholder="Buscar preguntas frecuentes..."
        value={searchTerm}
        onChange={handleChange}
        className={styles.searchInput}
        aria-label="Buscar preguntas frecuentes"
      />
    </div>
  );
};
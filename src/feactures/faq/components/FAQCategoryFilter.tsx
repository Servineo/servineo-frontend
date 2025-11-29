// frontend/src/features/faq/components/FAQCategoryFilter.tsx
'use client';

import React from 'react';
import { FAQCategoria } from '../types/faq.types';
import styles from '../styles/faq.module.css';

interface FAQCategoryFilterProps {
  selectedCategory: FAQCategoria | 'all';
  onCategoryChange: (category: FAQCategoria | 'all') => void;
}

const categories = [
  { value: 'all', label: 'Todas', icon: '📋' },
  { value: FAQCategoria.PROBLEMAS, label: 'Problemas', icon: '🔧' },
  { value: FAQCategoria.SERVICIOS, label: 'Servicios', icon: '⚡' },
  { value: FAQCategoria.PAGOS, label: 'Pagos', icon: '💳' },
  { value: FAQCategoria.GENERAL, label: 'General', icon: 'ℹ️' },
];

export const FAQCategoryFilter: React.FC<FAQCategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className={styles.categoryFilter}>
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => onCategoryChange(category.value as FAQCategoria | 'all')}
          className={`${styles.categoryButton} ${
            selectedCategory === category.value ? styles.categoryButtonActive : ''
          }`}
          aria-pressed={selectedCategory === category.value}
        >
          <span className={styles.categoryIcon}>{category.icon}</span>
          <span className={styles.categoryLabel}>{category.label}</span>
        </button>
      ))}
    </div>
  );
};
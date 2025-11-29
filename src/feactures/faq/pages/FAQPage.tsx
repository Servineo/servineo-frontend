// frontend/src/features/faq/pages/FAQPage.tsx
'use client';

import React from 'react';
import { FAQBreadcrumb } from '../components/FAQBreadcrumb';
import { FAQSearch } from '../components/FAQSearch';
import { FAQCategoryFilter } from '../components/FAQCategoryFilter';
import { FAQList } from '../components/FAQList';
import { FAQContact } from '../components/FAQContact';
import { useFAQ } from '../hooks/useFAQ';
import styles from '../styles/faq.module.css';

export const FAQPage: React.FC = () => {
  const { 
    faqs, 
    loading, 
    error, 
    selectedCategory,
    searchFAQs, 
    filterByCategory 
  } = useFAQ();

  return (
    <div className={styles.faqPage}>
      <div className={styles.faqContainer}>
        <FAQBreadcrumb />

        <div className={styles.faqHeader}>
          <h1 className={styles.faqTitle}>Preguntas Frecuentes</h1>
          <p className={styles.faqSubtitle}>
            Encuentra respuestas rápidas a las dudas más comunes
          </p>
        </div>

        <FAQSearch onSearch={searchFAQs} />

        <FAQCategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={filterByCategory}
        />

        {error && (
          <div className={styles.errorState}>
            <span className={styles.errorIcon}>⚠️</span>
            <span className={styles.errorText}>{error}</span>
          </div>
        )}

        {!loading && faqs.length > 0 && (
          <div className={styles.resultsCount}>
            Mostrando {faqs.length} {faqs.length === 1 ? 'resultado' : 'resultados'}
          </div>
        )}

        <FAQList faqs={faqs} loading={loading} />

        <FAQContact />
      </div>
    </div>
  );
};
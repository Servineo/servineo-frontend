// frontend/src/features/faq/components/FAQList.tsx
'use client';

import React from 'react';
import { FAQ } from '../types/faq.types';
import { FAQItem } from './FAQItem';
import { FAQSkeleton } from './FAQSkeleton';
import styles from '../styles/faq.module.css';

interface FAQListProps {
  faqs: FAQ[];
  loading: boolean;
}

export const FAQList: React.FC<FAQListProps> = ({ faqs, loading }) => {
  if (loading) {
    return <FAQSkeleton />;
  }

  if (faqs.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>🔍</div>
        <h3 className={styles.emptyTitle}>No se encontraron resultados</h3>
        <p className={styles.emptyMessage}>
          Intenta con otras palabras clave o navega por todas las preguntas frecuentes.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.faqList}>
      {faqs.map((faq) => (
        <FAQItem key={faq._id} faq={faq} />
      ))}
    </div>
  );
};
// frontend/src/features/faq/components/FAQItem.tsx
'use client';

import React, { useState } from 'react';
import { FAQ } from '../types/faq.types';
import styles from '../styles/faq.module.css';

interface FAQItemProps {
  faq: FAQ;
}

const getCategoryColor = (categoria: string): string => {
  const colors: Record<string, string> = {
    problemas: '#EF4444',
    servicios: '#2B31E0',
    pagos: '#F59E0B',
    general: '#759AE0',
  };
  return colors[categoria] || '#759AE0';
};

export const FAQItem: React.FC<FAQItemProps> = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className={styles.faqItem}>
      <button
        className={styles.faqQuestion}
        onClick={toggleOpen}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${faq._id}`}
      >
        <div style={{ flex: 1 }}>
          <span
            className={styles.faqCategory}
            style={{ backgroundColor: getCategoryColor(faq.categoria) }}
          >
            {faq.categoria}
          </span>
          <div className={styles.faqQuestionText}>{faq.pregunta}</div>
        </div>
        <span className={`${styles.faqIcon} ${isOpen ? styles.open : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div
          id={`faq-answer-${faq._id}`}
          className={styles.faqAnswer}
          role="region"
        >
          {faq.respuesta}
        </div>
      )}
    </div>
  );
};
// frontend/src/features/faq/components/FAQSkeleton.tsx
'use client';

import React from 'react';
import styles from '../styles/faq.module.css';

export const FAQSkeleton: React.FC = () => {
  return (
    <div className={styles.faqList}>
      {[1, 2, 3, 4, 5].map((item) => (
        <div key={item} className={styles.skeletonItem}>
          <div className={`${styles.skeletonLine} ${styles.title}`} />
          <div className={`${styles.skeletonLine} ${styles.subtitle}`} />
        </div>
      ))}
    </div>
  );
};
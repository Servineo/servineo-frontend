// frontend/src/features/faq/components/FAQBreadcrumb.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation'; // ⬅️ Cambio importante
import styles from '../styles/faq.module.css';

export const FAQBreadcrumb: React.FC = () => {
  const router = useRouter();

  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <ol className={styles.breadcrumbList}>
        <li className={styles.breadcrumbItem}>
          <button onClick={() => router.push('/')} className={styles.breadcrumbLink}>
            Home
          </button>
        </li>
        <li className={styles.breadcrumbSeparator}>›</li>
        <li className={styles.breadcrumbItem}>
          <button onClick={() => router.push('/ask-for-help')} className={styles.breadcrumbLink}>
            Ask for Help
          </button>
        </li>
        <li className={styles.breadcrumbSeparator}>›</li>
        <li className={styles.breadcrumbItem}>
          <span className={styles.breadcrumbCurrent}>Preguntas Frecuentes</span>
        </li>
      </ol>
    </nav>
  );
};
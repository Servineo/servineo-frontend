// frontend/src/features/faq/components/FAQContact.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation'; // ⬅️ Cambio importante
import styles from '../styles/faq.module.css';

export const FAQContact: React.FC = () => {
  const router = useRouter();

  const handleContactClick = () => {
    router.push('/ask-for-help/contact');
  };

  return (
    <div className={styles.contactSection}>
      <h3 className={styles.contactTitle}>¿No encontraste lo que buscabas?</h3>
      <p className={styles.contactMessage}>
        Nuestro equipo de soporte está listo para ayudarte con cualquier consulta.
      </p>
      <button
        onClick={handleContactClick}
        className={styles.contactButton}
        aria-label="Contactar con soporte"
      >
        Contacta soporte aquí 💬
      </button>
    </div>
  );
};
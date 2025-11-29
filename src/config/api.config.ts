// frontend/src/config/api.config.ts
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  ENDPOINTS: {
    FAQS: '/faqs',
    FAQS_SEARCH: '/faqs/search',
    FAQ_BY_ID: (id: string) => `/faqs/${id}`,
  },
  TIMEOUT: 10000,
};
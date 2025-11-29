// frontend/src/features/faq/services/faq.service.ts
import { API_CONFIG } from '../../../config/api.config';
import { FAQ, FAQResponse } from '../types/faq.types';

export class FAQService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  async getAllFAQs(): Promise<FAQ[]> {
    try {
      const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.FAQS}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: FAQResponse = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.message || 'Error al obtener FAQs');
      }

      return data.data;
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      throw error;
    }
  }

  async searchFAQs(query: string): Promise<FAQ[]> {
    try {
      const url = `${this.baseURL}${API_CONFIG.ENDPOINTS.FAQS_SEARCH}?q=${encodeURIComponent(query)}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: FAQResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Error en la búsqueda');
      }

      return data.data || [];
    } catch (error) {
      console.error('Error searching FAQs:', error);
      throw error;
    }
  }

  async getFAQById(id: string): Promise<FAQ> {
    try {
      const response = await fetch(
        `${this.baseURL}${API_CONFIG.ENDPOINTS.FAQ_BY_ID(id)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: FAQResponse = await response.json();

      if (!data.success || !data.data || data.data.length === 0) {
        throw new Error('FAQ no encontrado');
      }

      return data.data[0];
    } catch (error) {
      console.error('Error fetching FAQ by ID:', error);
      throw error;
    }
  }
}
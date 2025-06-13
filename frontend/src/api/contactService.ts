import api from './axios';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

interface ContactResponse {
  success: boolean;
  message: string;
}

export const contactService = {
  /**
   * Submit a contact form
   * @param data Contact form data
   * @returns Promise with the response
   */
  submitContactForm: async (data: ContactFormData): Promise<ContactResponse> => {
    try {
      const response = await api.post<ContactResponse>('/contact', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send message');
    }
  }
}; 
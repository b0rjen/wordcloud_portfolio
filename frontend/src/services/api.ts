import axios from 'axios';
import { WordCloudResponse, TextInput, URLInput } from '../types';

const API_BASE_URL = '';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const wordCloudAPI = {
  generateFromText: async (data: TextInput): Promise<WordCloudResponse> => {
    const response = await api.post('/generate/text', data);
    return response.data;
  },

  generateFromURL: async (data: URLInput): Promise<WordCloudResponse> => {
    const response = await api.post('/generate/url', data);
    return response.data;
  },

  generateImageFromText: async (data: TextInput): Promise<Blob> => {
    const response = await api.post('/generate/text/image', data, {
      responseType: 'blob',
    });
    return response.data;
  },

  generateImageFromURL: async (data: URLInput): Promise<Blob> => {
    const response = await api.post('/generate/url/image', data, {
      responseType: 'blob',
    });
    return response.data;
  },
};

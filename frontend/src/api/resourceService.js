import api from './axios';
import { setCache, getCache } from './cacheUtil';

export const getResources = async () => {
  if (navigator.onLine) {
    const response = await api.get('/resources');
    await setCache('resources', response.data);
    return response.data;
  } else {
    const cached = await getCache('resources');
    return cached || [];
  }
};

export const getResourceById = async (id) => {
  const response = await api.get(`/resources/${id}`);
  return response.data;
};

export const createResource = async (resourceData) => {
  const response = await api.post('/resources', resourceData);
  return response.data;
};

export const updateResource = async (id, resourceData) => {
  const response = await api.put(`/resources/${id}`, resourceData);
  return response.data;
};

export const deleteResource = async (id) => {
  const response = await api.delete(`/resources/${id}`);
  return response.data;
}; 
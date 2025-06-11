import api from './axios';

export const getStories = async () => {
  const response = await api.get('/stories');
  return response.data;
};

export const getFeaturedStories = async () => {
  const response = await api.get('/stories/featured');
  return response.data;
};

export const getStoryById = async (id) => {
  const response = await api.get(`/stories/${id}`);
  return response.data;
};

export const createStory = async (storyData) => {
  const response = await api.post('/stories', storyData);
  return response.data;
};

export const updateStory = async (id, storyData) => {
  const response = await api.put(`/stories/${id}`, storyData);
  return response.data;
};

export const deleteStory = async (id) => {
  const response = await api.delete(`/stories/${id}`);
  return response.data;
};

export const toggleStoryFeatured = async (id) => {
  const response = await api.put(`/stories/${id}/feature`);
  return response.data;
}; 
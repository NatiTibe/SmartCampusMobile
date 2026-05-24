// src/services/apiService.js
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
  baseURL: 'https://smart-campus-event-management-and.onrender.com/api',
  withCredentials: true,
});

export const apiClient = axios.create({
  baseURL: 'https://smart-campus-event-management-and.onrender.com/api',
  withCredentials: true,
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export const saveAccessToken = async (token) => {
  if (token) {
    await SecureStore.setItemAsync('accessToken', token);
    setAuthToken(token);
  } else {
    await SecureStore.deleteItemAsync('accessToken');
    setAuthToken(null);
  }
};

export const loadStoredToken = async () => {
  const token = await SecureStore.getItemAsync('accessToken');
  if (token) {
    setAuthToken(token);
  }
  return token;
};

export const getErrorMessage = (error) => {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  return 'Something went wrong. Please try again.';
};

export default api;
// src/services/apiService.js
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const api = axios.create({
  baseURL: 'https://smart-campus-event-management-and.onrender.com/api',
  withCredentials: true,
});

export const apiClient = axios.create({
  baseURL: 'https://smart-campus-event-management-and.onrender.com/api',
  withCredentials: true,
});

// Helper function to safely fetch the token based on platform
const fetchToken = async () => {
  try {
    return Platform.OS === 'web'
      ? localStorage.getItem('accessToken')
      : await SecureStore.getItemAsync('accessToken');
  } catch (error) {
    console.error("Error fetching token", error);
    return null;
  }
};

// NEW: Request Interceptor
// This intercepts EVERY request right before it leaves your app and slaps the token on it.
api.interceptors.request.use(
  async (config) => {
    const token = await fetchToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export const saveAccessToken = async (token) => {
  if (token) {
    if (Platform.OS === 'web') {
      localStorage.setItem('accessToken', token);
    } else {
      await SecureStore.setItemAsync('accessToken', token);
    }
    setAuthToken(token);
  } else {
    if (Platform.OS === 'web') {
      localStorage.removeItem('accessToken');
    } else {
      await SecureStore.deleteItemAsync('accessToken');
    }
    setAuthToken(null);
  }
};

export const loadStoredToken = async () => {
  const token = await fetchToken();
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
import { apiClient, saveAccessToken } from './apiService';

export const login = async (credentials) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);

    if (response && response.data) {
      const user = response.data?.user;
      const accessToken = response.data?.accessToken;

      if (!user || !accessToken) {
        throw new Error('Unexpected server response.');
      }

      await saveAccessToken(accessToken);
      return response.data;
    }

    throw new Error('No data received from server');
  } catch (error) {
    const err = error;
    console.error('Login failed:', err?.response?.data || err?.message || err);
    throw error;
  }
};

import { apiClient, saveAccessToken } from './apiService';

/**
 * Enhanced login service with better error logging and response handling
 */
export const login = async (credentials) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);

    if (response && response.data) {
      const user = response.data?.user;
      const accessToken = response.data?.accessToken;

      if (!user || !accessToken) {
        console.error("Login Error: Missing user or token in response", response.data);
        throw new Error('Server returned incomplete data.');
      }

      await saveAccessToken(accessToken);
      return response.data;
    }

    throw new Error('No data received from server');
    
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Unknown login failure';
    console.error('Login Process Failed:', errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Calls backend password recovery api setup to dispatch 6-digit codes
 */
export const forgotPassword = async (email) => {
  try {
    const response = await apiClient.post('/auth/forgot-password', { email });

    if (response && response.data) {
      return response.data;
    }

    throw new Error('No data received from server');
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Password reset request failed';
    console.error('Forgot Password Failed:', errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Alternative wrapper for password reset requests targeting the same route
 */
export const requestPasswordReset = async (email) => {
  try {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    const err = error;
    const errorMessage = err?.response?.data?.message || err?.message || 'Reset request failed';
    console.error('Forgot Password Failed:', errorMessage);
    throw new Error(errorMessage);
  }
};
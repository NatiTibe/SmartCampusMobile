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
 * Sends email to trigger backend hex-token generation
 * Matches backend route: authRouter.post("/forget-password", ...)
 */
export const forgotPassword = async (email) => {
  try {
    const response = await apiClient.post('/auth/forget-password', { email });

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
 * Sends the hex token and new password to the backend to complete the reset
 * Matches backend route: authRouter.post("/reset-password", ...)
 */
export const resetPassword = async (token, password) => {
  try {
    const response = await apiClient.post('/auth/reset-password', { token, password });
    
    if (response && response.data) {
      return response.data;
    }

    throw new Error('No data received from server');
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Invalid token or password reset failed';
    console.error('Reset Password Failed:', errorMessage);
    throw new Error(errorMessage);
  }
};
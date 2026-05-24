import { apiClient, saveAccessToken } from './apiService';

/**
 * Enhanced login service with better error logging and response handling
 */
export const login = async (credentials) => {
  try {
    // 1. Perform the API request
    const response = await apiClient.post('/auth/login', credentials);

    // 2. Validate the response structure
    if (response && response.data) {
      const user = response.data?.user;
      const accessToken = response.data?.accessToken;

      // 3. If the server returned a success status but data is missing, 
      // this is a logic error that needs to be caught
      if (!user || !accessToken) {
        console.error("Login Error: Missing user or token in response", response.data);
        throw new Error('Server returned incomplete data.');
      }

      // 4. Save the token and return the data
      await saveAccessToken(accessToken);
      return response.data;
    }

    // Fallback if response is empty
    throw new Error('No data received from server');
    
  } catch (error) {
    // 5. EXTRACT AND LOG THE REAL ERROR
    // This will print the actual reason (e.g., "Invalid Credentials") 
    // to your browser console so you don't have to guess
    const errorMessage = error.response?.data?.message || error.message || 'Unknown login failure';
    console.error('Login Process Failed:', errorMessage);
    
    // Re-throw so your LoginScreen can show the error to the user
    throw new Error(errorMessage);
  }
};
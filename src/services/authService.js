import api from './apiService';
import { saveAccessToken } from './apiService';

export const login = async ({ email, password }) => {
  const response = await api.post('/auth/login', { email, password });
  const user = response.data?.user;
  const accessToken = response.data?.accessToken;

  if (!user || !accessToken) {
    throw new Error('Unexpected server response.');
  }

  await saveAccessToken(accessToken);
  return { user, accessToken };
};

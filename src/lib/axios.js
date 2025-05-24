import axios from 'axios';
import { store } from '../app/store';

const api = axios.create({
  baseURL: 'https://learnify-server-s6fg.onrender.com/api',
});

// Add a request interceptor to add the token to every request
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers['x-access-token'] = token;
    }
    // Let axios set the appropriate Content-Type for FormData
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      store.dispatch({ type: 'auth/logout' });
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 
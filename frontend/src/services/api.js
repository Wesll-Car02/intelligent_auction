// frontend/src/services/api.js
// Service for making API calls to the backend
import axios from 'axios';

// Determine the backend API URL based on environment
// Use VITE_API_URL from .env during development/build, otherwise default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

console.log("Using API Base URL:", API_BASE_URL); // For debugging

// Create an Axios instance with the base URL
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Function to fetch all offers
export const getOfertas = () => {
    return apiClient.get('/ofertas');
};

// Function to toggle the favorite status of an offer
export const toggleFavoritoStatus = (id) => {
    // Ensure ID is passed correctly in the URL path
    return apiClient.patch(`/ofertas/${id}/favorito`);
};

// Optional: Add interceptors for error handling or token management if needed later
// apiClient.interceptors.response.use(
//   response => response,
//   error => {
//     console.error("API call error:", error.response || error.message || error);
//     // Handle errors globally here if desired
//     return Promise.reject(error);
//   }
// );

export default apiClient; // Can also export the configured instance
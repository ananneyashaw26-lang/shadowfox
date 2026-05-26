// Detect if running locally or in production (GitHub Pages)
export const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api'
  : 'https://zomato-clone-spnn.onrender.com/api';

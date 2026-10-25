import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('imovies_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Movies
export const getMovies = (params) => API.get('/movies', { params });
export const getMovie = (id) => API.get(`/movies/${id}`);
export const getMovieFilters = () => API.get('/movies/filters');

// Theatres
export const getTheatres = () => API.get('/theatres');

// Shows
export const getShowsByMovie = (movieId) => API.get(`/shows/movie/${movieId}`);
export const getShow = (showId) => API.get(`/shows/${showId}`);

// Bookings
export const createBooking = (data) => API.post('/bookings', data);
export const getMyBookings = () => API.get('/bookings/my');
export const getBooking = (id) => API.get(`/bookings/${id}`);
export const cancelBooking = (id) => API.put(`/bookings/${id}/cancel`);

export default API;

import { Book, User } from '../types';

const API_URL = 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

// Auth API
export const loginUser = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
};

export const registerUser = async (name: string, email: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse(response);
};

export const getCurrentUser = async (token: string) => {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

// Books API
export const getBooks = async (params: {
  genre?: string;
  search?: string;
  limit?: number;
  page?: number;
  sort?: string;
  order?: 'asc' | 'desc';
} = {}) => {
  const queryParams = new URLSearchParams();
  
  if (params.genre) queryParams.append('genre', params.genre);
  if (params.search) queryParams.append('search', params.search);
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.sort) queryParams.append('sort', params.sort);
  if (params.order) queryParams.append('order', params.order);
  
  const response = await fetch(`${API_URL}/books?${queryParams.toString()}`);
  return handleResponse(response);
};

export const getBookById = async (id: string) => {
  const response = await fetch(`${API_URL}/books/${id}`);
  return handleResponse(response);
};

export const addToLibrary = async (bookId: string, token: string) => {
  const response = await fetch(`${API_URL}/books/library/${bookId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const getUserLibrary = async (token: string) => {
  const response = await fetch(`${API_URL}/books/user/library`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const updateReadingProgress = async (bookId: string, progress: number, token: string) => {
  const response = await fetch(`${API_URL}/books/progress/${bookId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ progress }),
  });
  return handleResponse(response);
};

export const addReview = async (bookId: string, rating: number, comment: string, token: string) => {
  const response = await fetch(`${API_URL}/books/review/${bookId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ rating, comment }),
  });
  return handleResponse(response);
};

// User API
export const getUserProfile = async (token: string) => {
  const response = await fetch(`${API_URL}/users/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const updateUserProfile = async (userData: {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}, token: string) => {
  const response = await fetch(`${API_URL}/users/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const cancelSubscription = async (token: string) => {
  const response = await fetch(`${API_URL}/users/cancel-subscription`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

// Admin API
export const getAdminDashboard = async (token: string) => {
  const response = await fetch(`${API_URL}/admin/dashboard`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const getAdminUsers = async (params: {
  page?: number;
  limit?: number;
  search?: string;
} = {}, token: string) => {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);
  
  const response = await fetch(`${API_URL}/admin/users?${queryParams.toString()}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const addBook = async (bookData: FormData, token: string) => {
  const response = await fetch(`${API_URL}/admin/books`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: bookData,
  });
  return handleResponse(response);
};

export const updateBook = async (id: string, bookData: FormData, token: string) => {
  const response = await fetch(`${API_URL}/admin/books/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: bookData,
  });
  return handleResponse(response);
};

export const deleteBook = async (id: string, token: string) => {
  const response = await fetch(`${API_URL}/admin/books/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

// Subscription API
export const getSubscriptionPlans = async () => {
  const response = await fetch(`${API_URL}/subscriptions/plans`);
  return handleResponse(response);
};

export const getGenres = async (token: string) => {
  const response = await fetch(`${API_URL}/admin/genres`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};
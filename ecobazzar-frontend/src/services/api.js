import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
}, error => Promise.reject(error))

api.interceptors.response.use(res => res, error => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }
  return Promise.reject(error)
})

// Auth
export const authAPI = {
  login: creds => api.post('/auth/login', creds),
  register: data => api.post('/auth/register', data),
}

// Products
export const productsAPI = {
  getAll: () => api.get('/products'),
  getById: id => api.get(`/products/${id}`),
  search: params => api.get('/products/search', { params }),
  create: data => api.post('/products', data),
  update: (id,data) => api.put(`/products/${id}`, data),
  delete: id => api.delete(`/products/${id}`),
}

// Cart
export const cartAPI = {
  getItems: () => api.get('/cart'),
  addItem: item => api.post('/cart/add', item),
  removeItem: id => api.delete(`/cart/${id}`),
}

// Orders
export const ordersAPI = {
  getSellerOrders: () => api.get('/orders/seller/orders'),
  placeOrder: () => api.post('/orders/checkout'),
  getHistory: () => api.get('/orders/history'),
  getAllOrders: () => api.get('/orders'),
  updateStatus: (id,status) => api.put(`/orders/${id}`, { status }),
}

// Users
export const usersAPI = {
  getProfile: () => api.get('/profile/me'),
  updateProfile: data => api.put('/users/profile', data),
  updatePassword: data => api.put('/users/password', data),
}

// Admin - UPDATED WITH NEW FUNCTIONS
export const adminAPI = {
  getAllProducts: () => api.get('/admin/products'),
  getAllUsers: () => api.get('/admin/users'),
  getAllOrders: () => api.get('/admin/orders'),
  getAllSellers: () => api.get('/admin/sellers'), // NEW
  deleteSeller: (sellerId) => api.delete(`/admin/sellers/${sellerId}`), // NEW
  updateUserRole: (userId,newRoleId) => api.put(`/admin/users/${userId}/role`, { newRoleId }),
  
  // NEW ANALYTICS ENDPOINTS
  getTopCustomer: () => api.get('/admin/analytics/top-customer'),
  getTopSeller: () => api.get('/admin/analytics/top-seller'),
  getMostSoldProducts: () => api.get('/admin/analytics/most-sold-products'),
}

export const feedbackAPI = {
  submitFeedback: message => api.post('/feedback', { message }),
  getAllFeedback: () => api.get('/feedback'),
}

export default api

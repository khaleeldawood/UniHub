import api from './api';

const adminService = {
  /**
   * Get all users
   */
  getAllUsers: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.universityId) params.append('universityId', filters.universityId);
    if (filters.role) params.append('role', filters.role);
    
    const response = await api.get(`/admin/users?${params.toString()}`);
    return response.data;
  },

  /**
   * Get user by ID
   */
  getUserById: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  /**
   * Update user
   */
  updateUser: async (id, updates) => {
    const response = await api.put(`/admin/users/${id}`, updates);
    return response.data;
  },

  /**
   * Deactivate user
   */
  deactivateUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  /**
   * Delete user
   */
  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  /**
   * Create a user (Admin only)
   */
  createUser: async (userData) => {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },

  /**
   * Get all universities (alias for getAllUniversities)
   */
  getUniversities: async () => {
    const response = await api.get('/admin/universities');
    return response.data;
  },

  /**
   * Get all universities
   */
  getAllUniversities: async () => {
    const response = await api.get('/admin/universities');
    return response.data;
  },

  /**
   * Create university
   */
  createUniversity: async (universityData) => {
    const response = await api.post('/admin/universities', universityData);
    return response.data;
  },

  /**
   * Update university
   */
  updateUniversity: async (id, updates) => {
    const response = await api.put(`/admin/universities/${id}`, updates);
    return response.data;
  },

  /**
   * Delete university
   */
  deleteUniversity: async (id) => {
    const response = await api.delete(`/admin/universities/${id}`);
    return response.data;
  },

  /**
   * Get system analytics
   */
  getAnalytics: async () => {
    const response = await api.get('/admin/analytics');
    return response.data;
  }
};

export default adminService;

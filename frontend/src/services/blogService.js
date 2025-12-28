import api from './api';

const blogService = {
  /**
   * Get all blogs with filters
   */
  getAllBlogs: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.universityId) params.append('universityId', filters.universityId);
    if (filters.category) params.append('category', filters.category);
    if (filters.status) params.append('status', filters.status);
    if (filters.isGlobal !== undefined) params.append('isGlobal', filters.isGlobal);
    
    const response = await api.get(`/blogs?${params.toString()}`);
    return response.data;
  },

  /**
   * Get blog by ID
   */
  getBlogById: async (id) => {
    const response = await api.get(`/blogs/${id}`);
    return response.data;
  },

  /**
   * Create new blog
   */
  createBlog: async (blogData) => {
    const response = await api.post('/blogs', blogData);
    return response.data;
  },

  /**
   * Update an existing blog
   */
  updateBlog: async (blogId, blogData) => {
    const response = await api.put(`/blogs/${blogId}`, blogData);
    return response.data;
  },

  /**
   * Approve blog (Supervisor)
   */
  approveBlog: async (blogId) => {
    const response = await api.put(`/blogs/${blogId}/approve`);
    return response.data;
  },

  /**
   * Reject blog (Supervisor)
   */
  rejectBlog: async (blogId, reason) => {
    const response = await api.put(`/blogs/${blogId}/reject`, { reason });
    return response.data;
  },

  /**
   * Get my blogs
   */
  getMyBlogs: async () => {
    const response = await api.get('/blogs/my-blogs');
    return response.data;
  },

  /**
   * Get pending blogs (Supervisor)
   */
  getPendingBlogs: async () => {
    const response = await api.get('/blogs/pending');
    return response.data;
  },

  /**
   * Delete a blog (Author or Admin)
   */
  deleteBlog: async (blogId) => {
    const response = await api.delete(`/blogs/${blogId}`);
    return response.data;
  }
};

export default blogService;

import api from './api';

const reportService = {
  /**
   * Report a blog
   */
  reportBlog: async (blogId, reason) => {
    const response = await api.post(`/reports/blogs/${blogId}`, { reason });
    return response.data;
  },

  /**
   * Report an event
   */
  reportEvent: async (eventId, reason) => {
    const response = await api.post(`/reports/events/${eventId}`, { reason });
    return response.data;
  },

  /**
   * Get blog reports
   */
  getBlogReports: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    const response = await api.get(`/reports/blogs${params.toString() ? '?' + params.toString() : ''}`);
    return response.data;
  },

  /**
   * Get event reports
   */
  getEventReports: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    const response = await api.get(`/reports/events${params.toString() ? '?' + params.toString() : ''}`);
    return response.data;
  },

  /**
   * Resolve blog report
   */
  resolveBlogReport: async (reportId) => {
    const response = await api.put(`/reports/blogs/${reportId}/review`);
    return response.data;
  },

  /**
   * Dismiss blog report
   */
  dismissBlogReport: async (reportId) => {
    const response = await api.put(`/reports/blogs/${reportId}/dismiss`);
    return response.data;
  },

  /**
   * Resolve event report
   */
  resolveEventReport: async (reportId) => {
    const response = await api.put(`/reports/events/${reportId}/review`);
    return response.data;
  },

  /**
   * Dismiss event report
   */
  dismissEventReport: async (reportId) => {
    const response = await api.put(`/reports/events/${reportId}/dismiss`);
    return response.data;
  }
};

export default reportService;

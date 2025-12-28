import api from './api';

const notificationService = {
  /**
   * Get all notifications with filters
   */
  getNotifications: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.isRead !== undefined) params.append('isRead', filters.isRead);
    if (filters.type) params.append('type', filters.type);
    
    const response = await api.get(`/notifications?${params.toString()}`);
    return response.data;
  },

  /**
   * Get unread notification count
   */
  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data.unreadCount;
  },

  /**
   * Mark notification as read
   */
  markAsRead: async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  }
};

export default notificationService;

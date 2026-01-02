import api from './api';

const participationRequestService = {
  submitRequest: async (eventId, requestedRole) => {
    const response = await api.post(`/event-participation-requests/events/${eventId}`, { requestedRole });
    return response.data;
  },

  getEventRequests: async (eventId) => {
    const response = await api.get(`/event-participation-requests/events/${eventId}`);
    return response.data;
  },

  getMyRequests: async () => {
    const response = await api.get('/event-participation-requests/my-requests');
    return response.data;
  },

  approveRequest: async (requestId) => {
    const response = await api.post(`/event-participation-requests/${requestId}/approve`);
    return response.data;
  },

  rejectRequest: async (requestId) => {
    const response = await api.post(`/event-participation-requests/${requestId}/reject`);
    return response.data;
  }
};

export default participationRequestService;

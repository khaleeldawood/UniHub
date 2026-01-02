import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Badge, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import eventService from '../services/eventService';
import participationRequestService from '../services/participationRequestService';
import { formatDate } from '../utils/helpers';

const MyEventRequests = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [requests, setRequests] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const eventsData = await eventService.getMyEvents();
      setMyEvents(Array.isArray(eventsData) ? eventsData : []);

      // Load requests for each event
      const requestsMap = {};
      for (const event of eventsData) {
        try {
          const eventRequests = await participationRequestService.getEventRequests(event.eventId);
          if (eventRequests.length > 0) {
            requestsMap[event.eventId] = eventRequests;
          }
        } catch (err) {
          console.warn(`Failed to load requests for event ${event.eventId}:`, err);
        }
      }
      setRequests(requestsMap);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load event requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    setProcessing(requestId);
    try {
      await participationRequestService.approveRequest(requestId);
      setSuccess('Request approved successfully');
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve request');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (requestId) => {
    setProcessing(requestId);
    try {
      await participationRequestService.rejectRequest(requestId);
      setSuccess('Request rejected');
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject request');
    } finally {
      setProcessing(null);
    }
  };

  const totalRequests = Object.values(requests).reduce((sum, reqs) => sum + reqs.length, 0);

  return (
    <Container className="py-4">
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      <h2 className="mb-4">Event Participation Requests ({totalRequests})</h2>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
        </div>
      ) : totalRequests > 0 ? (
        Object.entries(requests).map(([eventId, eventRequests]) => {
          const event = myEvents.find(e => e.eventId === parseInt(eventId));
          return (
            <Card key={eventId} className="mb-4">
              <Card.Header>
                <h5 className="mb-0">
                  <Link to={`/events/${eventId}`}>{event?.title || 'Event'}</Link>
                  <Badge bg="warning" className="ms-2">{eventRequests.length} Pending</Badge>
                </h5>
              </Card.Header>
              <Card.Body>
                <Table responsive hover>
                  <thead style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                    <tr>
                      <th style={{ fontWeight: '600', padding: '1rem' }}>User</th>
                      <th style={{ fontWeight: '600', padding: '1rem' }}>Role</th>
                      <th style={{ fontWeight: '600', padding: '1rem' }}>Requested</th>
                      <th style={{ fontWeight: '600', padding: '1rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventRequests.map(request => (
                      <tr key={request.requestId}>
                        <td style={{ fontWeight: '500', padding: '1rem' }}>
                          {request.userName}
                          <div className="text-muted small">{request.userEmail}</div>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <Badge bg="info">{request.requestedRole}</Badge>
                        </td>
                        <td style={{ padding: '1rem' }}>{formatDate(request.requestedAt)}</td>
                        <td style={{ padding: '1rem' }}>
                          <div className="d-flex gap-2">
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => handleApprove(request.requestId)}
                              disabled={processing === request.requestId}
                            >
                              {processing === request.requestId ? 'Processing...' : 'Approve'}
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleReject(request.requestId)}
                              disabled={processing === request.requestId}
                            >
                              {processing === request.requestId ? 'Processing...' : 'Reject'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          );
        })
      ) : (
        <Card>
          <Card.Body className="text-center py-5">
            <p className="text-muted mb-0">No pending participation requests</p>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default MyEventRequests;

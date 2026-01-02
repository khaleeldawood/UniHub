import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Badge, Alert, Tabs, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import participationRequestService from '../services/participationRequestService';
import { formatDate } from '../utils/helpers';

const EventParticipationRequests = () => {
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadMyRequests();
  }, []);

  const loadMyRequests = async () => {
    try {
      const data = await participationRequestService.getMyRequests();
      setMyRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load requests:', err);
      setError('Failed to load participation requests');
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <Container className="py-4">
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      <h2 className="mb-4">My Participation Requests</h2>

      <Card>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : myRequests.length > 0 ? (
            <Table responsive hover>
              <thead style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <tr>
                  <th style={{ fontWeight: '600', padding: '1rem' }}>Event</th>
                  <th style={{ fontWeight: '600', padding: '1rem' }}>Role</th>
                  <th style={{ fontWeight: '600', padding: '1rem' }}>Status</th>
                  <th style={{ fontWeight: '600', padding: '1rem' }}>Requested</th>
                  <th style={{ fontWeight: '600', padding: '1rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {myRequests.map(request => (
                  <tr key={request.requestId}>
                    <td style={{ fontWeight: '500', padding: '1rem' }}>
                      <Link to={`/events/${request.eventId}`}>{request.eventTitle}</Link>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <Badge bg="info">{request.requestedRole}</Badge>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <Badge bg={getStatusVariant(request.status)}>{request.status}</Badge>
                    </td>
                    <td style={{ padding: '1rem' }}>{formatDate(request.requestedAt)}</td>
                    <td style={{ padding: '1rem' }}>
                      <Button 
                        as={Link}
                        to={`/events/${request.eventId}`}
                        size="sm"
                        variant="outline-primary"
                      >
                        View Event
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center text-muted py-5">No participation requests yet</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EventParticipationRequests;

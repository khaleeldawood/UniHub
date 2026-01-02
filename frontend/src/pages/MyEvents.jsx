import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Card, Table, Badge, Button } from 'react-bootstrap';
import eventService from '../services/eventService';
import { formatDate, getStatusVariant } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES } from '../utils/constants';
import ConfirmationModal from '../components/common/ConfirmationModal';

const MyEvents = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadMyEvents();
  }, []);

  const loadMyEvents = async () => {
    try {
      const data = await eventService.getMyEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsProcessing(true);
    try {
      await eventService.deleteEvent(selectedEvent.eventId);
      setEvents(events.filter(e => e.eventId !== selectedEvent.eventId));
      setShowDeleteModal(false);
      setSelectedEvent(null);
    } catch (error) {
      alert('Failed to delete event: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    setIsProcessing(true);
    try {
      await eventService.cancelEvent(selectedEvent.eventId);
      loadMyEvents();
      setShowCancelModal(false);
      setSelectedEvent(null);
    } catch (error) {
      alert('Failed to cancel event: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">📅 My Events</h2>
      <Card>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : events.length > 0 ? (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Start Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map(event => (
                  <tr key={event.eventId} style={{ cursor: 'pointer' }} onClick={() => navigate(`/events/${event.eventId}`)}>
                    <td style={{ fontWeight: '500' }}>{event.title}</td>
                    <td>{event.type}</td>
                    <td>{formatDate(event.startDate)}</td>
                    <td><Badge bg={getStatusVariant(event.status)} style={{ fontSize: '0.85rem', fontWeight: '600' }}>{event.status}</Badge></td>
                    <td>
                      <div className="d-flex gap-2" onClick={(e) => e.stopPropagation()}>
                        {/* View Details */}
                        <Button 
                          as={Link}
                          to={`/events/${event.eventId}`}
                          size="sm" 
                          variant="outline-primary"
                          title="View details"
                        >
                          View
                        </Button>
                        
                        {/* Edit button for PENDING and APPROVED events */}
                        {(event.status === 'PENDING' || event.status === 'APPROVED') && (
                          <Button 
                            as={Link}
                            to={`/events/${event.eventId}/edit`}
                            size="sm" 
                            variant="outline-info"
                            title={event.status === 'APPROVED' ? 'Edit (will reset to PENDING)' : 'Edit event'}
                          >
                            Edit
                          </Button>
                        )}
                        
                        {/* Only allow deletion for PENDING or REJECTED events */}
                        {(event.status === 'PENDING' || event.status === 'REJECTED') && (
                          <Button 
                            size="sm" 
                            variant="danger"
                            onClick={() => { setSelectedEvent(event); setShowDeleteModal(true); }}
                            title="Delete event"
                          >
                            Delete
                          </Button>
                        )}
                        
                        {/* Allow cancellation for APPROVED events (admin or supervisor only) */}
                        {event.status === 'APPROVED' && (user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.SUPERVISOR) && (
                          <Button 
                            size="sm" 
                            variant="warning"
                            onClick={() => { setSelectedEvent(event); setShowCancelModal(true); }}
                            title="Cancel event"
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center text-muted py-5">No events created yet</p>
          )}
        </Card.Body>
      </Card>

      <ConfirmationModal
        show={showDeleteModal}
        onHide={() => { setShowDeleteModal(false); setSelectedEvent(null); }}
        onConfirm={handleDelete}
        title="Delete Event"
        message="Are you sure you want to delete this event?"
        itemName={selectedEvent?.title}
        confirmText="Delete"
        confirmVariant="danger"
        isLoading={isProcessing}
      />

      <ConfirmationModal
        show={showCancelModal}
        onHide={() => { setShowCancelModal(false); setSelectedEvent(null); }}
        onConfirm={handleCancel}
        title="Cancel Event"
        message="Are you sure you want to cancel this event?"
        itemName={selectedEvent?.title}
        confirmText="Cancel Event"
        confirmVariant="warning"
        isLoading={isProcessing}
      />
    </Container>
  );
};

export default MyEvents;

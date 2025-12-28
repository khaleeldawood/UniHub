import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Card, Button, Badge, Row, Col, Alert, Modal, Form } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import eventService from '../services/eventService';
import reportService from '../services/reportService';
import { formatDate, getStatusVariant, getRoleVariant } from '../utils/helpers';
import { PARTICIPANT_ROLES, PARTICIPANT_POINTS } from '../utils/constants';

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(PARTICIPANT_ROLES.ATTENDEE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportingEvent, setReportingEvent] = useState(false);

  useEffect(() => {
    loadEventDetails();
  }, [id]);

  const loadEventDetails = async () => {
    try {
      const eventData = await eventService.getEventById(id);
      setEvent(eventData);

      try {
        const participantsData = await eventService.getEventParticipants(id);
        setParticipants(Array.isArray(participantsData) ? participantsData : []);
      } catch (participantsError) {
        console.warn('Failed to load participants:', participantsError);
        setParticipants([]);
      }
    } catch (err) {
      console.error('Failed to load event details:', err);
      setError('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinEvent = async () => {
    setError('');
    try {
      await eventService.joinEvent(id, selectedRole);
      const points = event[`${selectedRole.toLowerCase()}Points`] || PARTICIPANT_POINTS[selectedRole];
      setSuccess(`Successfully joined as ${selectedRole}! You earned ${points} points!`);
      setShowJoinModal(false);
      loadEventDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join event');
    }
  };

  const handleLeaveEvent = async () => {
    if (!window.confirm('⚠️ Are you sure? You will be penalized 2x the points you earned!')) {
      return;
    }
    
    setError('');
    try {
      await eventService.leaveEvent(id);
      setSuccess('You have left the event. Penalty has been applied.');
      loadEventDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to leave event');
    }
  };

  const handleReportEvent = async () => {
    if (!reportReason.trim()) {
      setError('Please provide a reason for reporting');
      return;
    }
    
    setReportingEvent(true);
    try {
      await reportService.reportEvent(id, reportReason);
      setSuccess('Event reported successfully. Our team will review it.');
      setShowReportModal(false);
      setReportReason('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to report event');
    } finally {
      setReportingEvent(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" />
      </Container>
    );
  }

  if (!event) {
    return (
      <Container className="py-5">
        <Alert variant="danger">Event not found</Alert>
      </Container>
    );
  }

  const isCompleted = new Date(event.endDate) < new Date();
  const canReportEvent = user && (event.status === 'PENDING' || event.status === 'APPROVED') && !isCompleted;

  return (
    <Container className="py-4">
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h3 className="mb-0">{event.title}</h3>
                  {isCompleted && (
                    <Badge bg="dark" className="mt-2">
                      Event Completed
                    </Badge>
                  )}
                </div>
                <Badge bg={getStatusVariant(event.status)}>{event.status}</Badge>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <Badge bg="secondary">{event.type}</Badge>
              </div>
              <p className="lead">{event.description}</p>
              <hr />
              <Row className="mb-3">
                <Col md={6}>
                  <strong>📍 Location:</strong><br />
                  {event.location}
                </Col>
                <Col md={6}>
                  <strong>👤 Organizer:</strong><br />
                  {event.creator?.name}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>🕒 Start:</strong><br />
                  {formatDate(event.startDate)}
                </Col>
                <Col md={6}>
                  <strong>🕒 End:</strong><br />
                  {formatDate(event.endDate)}
                </Col>
              </Row>
              
              {(event.maxOrganizers || event.maxVolunteers || event.maxAttendees) && (
                <>
                  <hr />
                  <h5 className="mb-3">🎯 Event Capacity</h5>
                  <Row>
                    {event.maxOrganizers && (
                      <Col md={4}>
                        <strong>Organizers:</strong><br />
                        {participants.filter(p => p.role === 'ORGANIZER').length} / {event.maxOrganizers}
                        <div className="small text-muted">({event.organizerPoints} pts)</div>
                      </Col>
                    )}
                    {event.maxVolunteers && (
                      <Col md={4}>
                        <strong>Volunteers:</strong><br />
                        {participants.filter(p => p.role === 'VOLUNTEER').length} / {event.maxVolunteers}
                        <div className="small text-muted">({event.volunteerPoints} pts)</div>
                      </Col>
                    )}
                    {event.maxAttendees && (
                      <Col md={4}>
                        <strong>Attendees:</strong><br />
                        {participants.filter(p => p.role === 'ATTENDEE').length} / {event.maxAttendees}
                        <div className="small text-muted">({event.attendeePoints} pts)</div>
                      </Col>
                    )}
                  </Row>
                </>
              )}
            </Card.Body>
          </Card>

          {user && event.status === 'APPROVED' && (
            <>
              {/* Check if user is already participating */}
              {participants.some(p => p.user.userId === user.userId) ? (
                <Card className="mb-3 border-warning">
                  <Card.Body>
                    <h5>✅ You are participating in this event</h5>
                    <p>Role: <Badge bg={getRoleVariant(participants.find(p => p.user.userId === user.userId)?.role)}>
                      {participants.find(p => p.user.userId === user.userId)?.role}
                    </Badge></p>
                    <Button variant="warning" size="sm" onClick={handleLeaveEvent}>
                      ⚠️ Leave Event (Penalty: -2x points)
                    </Button>
                  </Card.Body>
                </Card>
              ) : (
                <Card className="mb-3">
                  <Card.Body>
                    <h5>Join This Event</h5>
                    <p>Choose your participation role and earn points!</p>
                    <div className="d-flex gap-2 flex-wrap">
                      {(!event.maxOrganizers || participants.filter(p => p.role === 'ORGANIZER').length < event.maxOrganizers) && (
                        <Button 
                          variant="danger" 
                          onClick={() => { setSelectedRole(PARTICIPANT_ROLES.ORGANIZER); setShowJoinModal(true); }}
                        >
                          Organizer ({event.organizerPoints} pts)
                        </Button>
                      )}
                      {(!event.maxVolunteers || participants.filter(p => p.role === 'VOLUNTEER').length < event.maxVolunteers) && (
                        <Button 
                          variant="success" 
                          onClick={() => { setSelectedRole(PARTICIPANT_ROLES.VOLUNTEER); setShowJoinModal(true); }}
                        >
                          Volunteer ({event.volunteerPoints} pts)
                        </Button>
                      )}
                      {(!event.maxAttendees || participants.filter(p => p.role === 'ATTENDEE').length < event.maxAttendees) && (
                        <Button 
                          variant="info" 
                          onClick={() => { setSelectedRole(PARTICIPANT_ROLES.ATTENDEE); setShowJoinModal(true); }}
                        >
                          Attendee ({event.attendeePoints} pts)
                        </Button>
                      )}
                    </div>
                    {event.maxOrganizers && participants.filter(p => p.role === 'ORGANIZER').length >= event.maxOrganizers &&
                     event.maxVolunteers && participants.filter(p => p.role === 'VOLUNTEER').length >= event.maxVolunteers &&
                     event.maxAttendees && participants.filter(p => p.role === 'ATTENDEE').length >= event.maxAttendees && (
                      <Alert variant="warning" className="mt-3 mb-0">
                        🔒 All roles are fully booked
                      </Alert>
                    )}
                  </Card.Body>
                </Card>
              )}
            </>
          )}

          {canReportEvent && (
            <Card>
              <Card.Body>
                <h5 className="text-danger">🚨 Report This Event</h5>
                <p className="text-muted small">If you find this event inappropriate or violates community guidelines</p>
                <Button variant="outline-danger" size="sm" onClick={() => setShowReportModal(true)}>
                  Report Event
                </Button>
              </Card.Body>
            </Card>
          )}
        </Col>

        <Col md={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">👥 Participants ({participants.length})</h5>
            </Card.Header>
            <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {participants.map(p => (
                <div key={p.participantId} className="d-flex justify-content-between align-items-center mb-2">
                  <span>{p.user.name}</span>
                  <Badge bg={getRoleVariant(p.role)}>{p.role}</Badge>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showJoinModal} onHide={() => setShowJoinModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Join Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You are joining as: <Badge bg={getRoleVariant(selectedRole)}>{selectedRole}</Badge></p>
          <p>You will earn <strong>{event?.[`${selectedRole.toLowerCase()}Points`] || PARTICIPANT_POINTS[selectedRole]} points</strong>!</p>
          <Alert variant="info" className="mb-0">
            ℹ️ You can only participate in one role per event
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowJoinModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleJoinEvent}>Confirm</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showReportModal} onHide={() => setShowReportModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Report Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Reason for reporting</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Please explain why you are reporting this event..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReportModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleReportEvent}
            disabled={reportingEvent}
          >
            {reportingEvent ? 'Reporting...' : 'Submit Report'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default EventDetails;

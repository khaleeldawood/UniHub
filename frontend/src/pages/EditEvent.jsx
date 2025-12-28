import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import eventService from '../services/eventService';
import adminService from '../services/adminService';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    type: 'Workshop',
    maxOrganizers: '',
    maxVolunteers: '',
    maxAttendees: '',
    organizerPoints: 50,
    volunteerPoints: 20,
    attendeePoints: 10
  });
  const [universities, setUniversities] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUniversities();
    loadEvent();
  }, [id]);

  const loadUniversities = async () => {
    try {
      const data = await adminService.getUniversities();
      setUniversities(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load universities:', error);
    }
  };

  const loadEvent = async () => {
    try {
      const event = await eventService.getEventById(id);
      
      // Check if user is the owner
      if (event.creator?.userId !== user.userId) {
        setError('You do not have permission to edit this event');
        setLoading(false);
        return;
      }

      // Allow editing PENDING and APPROVED events
      if (event.status !== 'PENDING' && event.status !== 'APPROVED') {
        setError('Only pending or approved events can be edited');
        setLoading(false);
        return;
      }

      // Format dates for datetime-local input
      const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
      };

      setFormData({
        title: event.title || '',
        description: event.description || '',
        location: event.location || '',
        startDate: formatDateForInput(event.startDate),
        endDate: formatDateForInput(event.endDate),
        type: event.type || 'Workshop',
        maxOrganizers: event.maxOrganizers || '',
        maxVolunteers: event.maxVolunteers || '',
        maxAttendees: event.maxAttendees || '',
        organizerPoints: event.organizerPoints || 50,
        volunteerPoints: event.volunteerPoints || 20,
        attendeePoints: event.attendeePoints || 10
      });
    } catch (err) {
      setError('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    // Client-side validation
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setError('End date must be after start date');
      setSaving(false);
      return;
    }

    if (new Date(formData.startDate) <= new Date()) {
      setError('Start date must be in the future');
      setSaving(false);
      return;
    }

    try {
      // Prepare data
      const eventData = {
        ...formData,
        maxOrganizers: formData.maxOrganizers ? parseInt(formData.maxOrganizers) : null,
        maxVolunteers: formData.maxVolunteers ? parseInt(formData.maxVolunteers) : null,
        maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : null,
        organizerPoints: parseInt(formData.organizerPoints),
        volunteerPoints: parseInt(formData.volunteerPoints),
        attendeePoints: parseInt(formData.attendeePoints)
      };
      
      await eventService.updateEvent(id, eventData);
      navigate('/my-events');
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to update event. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" />
      </Container>
    );
  }

  if (error && !formData.title) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error}</Alert>
        <Button variant="secondary" onClick={() => navigate('/my-events')}>
          Back to My Events
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Card style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card.Header>
          <h3>✏️ Edit Event</h3>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {formData.title && new Date().getTime() > 0 && (
            <Alert variant="warning">
              ⚠️ <strong>Note:</strong> Editing an approved event will reset its status to PENDING and require re-approval by a supervisor.
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Event Title *</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                minLength={3}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Location (University) *</Form.Label>
              <Form.Select
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              >
                <option value="">Select a university...</option>
                {universities.map(uni => (
                  <option key={uni.universityId} value={uni.name}>
                    {uni.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Event Type *</Form.Label>
              <Form.Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
                <option value="Conference">Conference</option>
                <option value="Meetup">Meetup</option>
                <option value="Competition">Competition</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Start Date & Time *</Form.Label>
              <Form.Control
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>End Date & Time *</Form.Label>
              <Form.Control
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <hr className="my-4" />
            <h5 className="mb-3">🎯 Capacity Limits</h5>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Max Organizers</Form.Label>
                  <Form.Control
                    type="number"
                    name="maxOrganizers"
                    value={formData.maxOrganizers}
                    onChange={handleChange}
                    min="0"
                    placeholder="Unlimited"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Max Volunteers</Form.Label>
                  <Form.Control
                    type="number"
                    name="maxVolunteers"
                    value={formData.maxVolunteers}
                    onChange={handleChange}
                    min="0"
                    placeholder="Unlimited"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Max Attendees</Form.Label>
                  <Form.Control
                    type="number"
                    name="maxAttendees"
                    value={formData.maxAttendees}
                    onChange={handleChange}
                    min="0"
                    placeholder="Unlimited"
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-2">
              <Button 
                type="submit" 
                variant="primary" 
                disabled={saving}
              >
                {saving ? 'Saving...' : '💾 Save Changes'}
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => navigate('/my-events')}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditEvent;

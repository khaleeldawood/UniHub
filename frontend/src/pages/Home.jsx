import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Button, Card, Row, Col, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import eventService from '../services/eventService';
import blogService from '../services/blogService';
import gamificationService from '../services/gamificationService';
import { formatDate, truncateText } from '../utils/helpers';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [topMembers, setTopMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard');
    } else {
      loadHomeData();
    }
  }, [isAuthenticated, navigate]);

  const loadHomeData = async () => {
    try {
      // Load recent approved events
      const events = await eventService.getAllEvents({ status: 'APPROVED' });
      const sortedEvents = Array.isArray(events) ? [...events].sort((a, b) => {
        const now = new Date();
        const aEnded = new Date(a.endDate) < now;
        const bEnded = new Date(b.endDate) < now;

        if (aEnded && !bEnded) return 1;
        if (!aEnded && bEnded) return -1;

        const aTimestamp = new Date(a.createdAt || a.startDate || 0).getTime();
        const bTimestamp = new Date(b.createdAt || b.startDate || 0).getTime();
        return bTimestamp - aTimestamp;
      }) : [];
      setRecentEvents(sortedEvents.slice(0, 3));

      // Load recent approved blogs
      const blogs = await blogService.getAllBlogs({ status: 'APPROVED' });
      const sortedBlogs = Array.isArray(blogs) ? [...blogs].sort((a, b) => {
        const aTimestamp = new Date(a.createdAt || 0).getTime();
        const bTimestamp = new Date(b.createdAt || 0).getTime();
        return bTimestamp - aTimestamp;
      }) : [];
      setRecentBlogs(sortedBlogs.slice(0, 3));

      // Load top 3 members for leaderboard sneak peek
      const members = await gamificationService.getTopMembers('GLOBAL', null, 3);
      setTopMembers(Array.isArray(members) ? members : []);
    } catch (error) {
      console.error('Failed to load home data:', error);
      setRecentEvents([]);
      setRecentBlogs([]);
      setTopMembers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-primary text-white py-5" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}>
        <Container>
          <div className="text-center py-5">
            <h1 className="display-3 fw-bold mb-4 text-shadow">Welcome to UniHub</h1>
            <p className="lead mb-4" style={{ fontSize: '1.5rem', fontWeight: '500', color: '#fff', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.2)' }}>
              Connect, Create, and Participate in your university community
            </p>
            <div>
              <Button 
                as={Link} 
                to="/register" 
                variant="light" 
                size="lg" 
                className="me-3"
                style={{ fontWeight: '700', padding: '0.875rem 2rem', fontSize: '1.125rem', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' }}
              >
                Get Started
              </Button>
              <Button 
                as={Link} 
                to="/login" 
                size="lg"
                style={{ 
                  fontWeight: '700', 
                  padding: '0.875rem 2rem', 
                  fontSize: '1.125rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  border: '2px solid white',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                }}
              >
                Login
              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="py-5">
        <h2 className="text-center mb-4">What is UniHub?</h2>
        <Row className="g-4">
          <Col md={3}>
            <Card className="h-100 text-center">
              <Card.Body>
                <div className="display-4 mb-3">📅</div>
                <Card.Title>Events</Card.Title>
                <Card.Text>
                  Create and participate in university events. Earn points as organizer, volunteer, or attendee.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 text-center">
              <Card.Body>
                <div className="display-4 mb-3">📝</div>
                <Card.Title>Blogs & Opportunities</Card.Title>
                <Card.Text>
                  Share articles, internships, and job opportunities with your peers.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 text-center">
              <Card.Body>
                <div className="display-4 mb-3">🏆</div>
                <Card.Title>Points & Badges</Card.Title>
                <Card.Text>
                  Earn points for contributions and unlock achievement badges as you level up.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 text-center">
              <Card.Body>
                <div className="display-4 mb-3">📊</div>
                <Card.Title>Leaderboard</Card.Title>
                <Card.Text>
                  Compete with peers and see top contributors across universities.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Recent Events Preview */}
      <div className="bg-light py-5">
        <Container>
          <h2 className="text-center mb-4">Recent Events</h2>
          <Row className="g-4">
            {recentEvents.map(event => (
              <Col md={4} key={event.eventId}>
                <Card 
                  as={Link} 
                  to={`/events/${event.eventId}`}
                  className="card-hover-lift text-decoration-none"
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Body>
                    <Card.Title>{event.title}</Card.Title>
                    {new Date(event.endDate) < new Date() && (
                      <Badge bg="dark" className="mb-2">
                        Event Completed
                      </Badge>
                    )}
                    <Card.Text>{truncateText(event.description, 100)}</Card.Text>
                    <div className="text-muted small">
                      📍 {event.location} • {formatDate(event.startDate)}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="text-center mt-4">
            <Button as={Link} to="/events" variant="primary">
              View All Events
            </Button>
          </div>
        </Container>
      </div>

      {/* Recent Blogs Preview */}
      <Container className="py-5">
        <h2 className="text-center mb-4">Recent Blogs</h2>
        <Row className="g-4">
          {recentBlogs.map(blog => (
            <Col md={4} key={blog.blogId}>
              <Card 
                as={Link} 
                to={`/blogs/${blog.blogId}`}
                className="card-hover-lift text-decoration-none"
                style={{ cursor: 'pointer' }}
              >
                <Card.Body>
                  <Badge bg="info" className="mb-2">{blog.category}</Badge>
                  <Card.Title>{blog.title}</Card.Title>
                  <Card.Text>{truncateText(blog.content, 100)}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <div className="text-center mt-4">
          <Button as={Link} to="/blogs" variant="primary">
            View All Blogs
          </Button>
        </div>
      </Container>

      {/* Leaderboard Sneak Peek */}
      <div className="bg-light py-5">
        <Container>
          <h2 className="text-center mb-4">Top Contributors</h2>
          <Row className="justify-content-center">
            <Col md={6}>
              <Card>
                <Card.Body>
                  {topMembers.map((member, index) => (
                    <div key={member.userId} className="d-flex align-items-center mb-3">
                      <div className="me-3">
                        <h2 className="text-muted mb-0">#{index + 1}</h2>
                      </div>
                      <div className="flex-grow-1">
                        <strong>{member.name}</strong>
                        <div className="text-muted small">{member.university?.name}</div>
                      </div>
                      <div>
                        <Badge bg="primary" pill>{member.points} pts</Badge>
                      </div>
                    </div>
                  ))}
                </Card.Body>
              </Card>
              <div className="text-center mt-3">
                <Button as={Link} to="/leaderboard" variant="outline-primary">
                  View Full Leaderboard
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Call to Action */}
      <Container className="py-5 text-center">
        <h2 className="mb-4">Join Your University Portal Today!</h2>
        <p className="lead mb-4">
          Start participating, earning points, and climbing the leaderboard
        </p>
        <Button as={Link} to="/register" variant="primary" size="lg">
          Register Now
        </Button>
      </Container>
    </div>
  );
};

export default Home;

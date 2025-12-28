import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import adminService from '../services/adminService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await adminService.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" />
      </Container>
    );
  }

  const chartData = analytics?.usersByRole ? [
    { name: 'Students', value: analytics.usersByRole.students },
    { name: 'Supervisors', value: analytics.usersByRole.supervisors },
    { name: 'Admins', value: analytics.usersByRole.admins }
  ] : [];

  return (
    <Container className="py-4">
      <h2 className="mb-4">📊 System Analytics</h2>
      
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3>{analytics?.totalUsers || 0}</h3>
              <p className="text-muted mb-0">Total Users</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3>{analytics?.totalEvents || 0}</h3>
              <p className="text-muted mb-0">Total Events</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3>{analytics?.totalBlogs || 0}</h3>
              <p className="text-muted mb-0">Total Blogs</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3>{analytics?.totalUniversities || 0}</h3>
              <p className="text-muted mb-0">Universities</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Header><h5 className="mb-0">Users by Role</h5></Card.Header>
        <Card.Body>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#0d6efd" />
            </BarChart>
          </ResponsiveContainer>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminAnalytics;

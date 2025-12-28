import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <Card style={{ maxWidth: '450px', width: '100%', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)', border: 'none', borderRadius: '1rem' }}>
        <Card.Body style={{ padding: '2.5rem' }}>
          <div className="text-center mb-4">
            <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#0d6efd', marginBottom: '0.5rem' }}>🎓 UniHub</h2>
            <p className="text-muted" style={{ fontSize: '1.125rem' }}>Login to your account</p>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: '600', fontSize: '1rem', color: '#212529' }}>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="your.email@university.edu"
                value={formData.email}
                onChange={handleChange}
                required
                style={{ 
                  padding: '0.75rem', 
                  fontSize: '1rem',
                  border: '2px solid #dee2e6',
                  borderRadius: '0.5rem'
                }}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label style={{ fontWeight: '600', fontSize: '1rem', color: '#212529' }}>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{ 
                  padding: '0.75rem', 
                  fontSize: '1rem',
                  border: '2px solid #dee2e6',
                  borderRadius: '0.5rem'
                }}
              />
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 mb-3"
              disabled={loading}
              style={{
                padding: '0.875rem',
                fontSize: '1.125rem',
                fontWeight: '600',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 8px rgba(13, 110, 253, 0.25)'
              }}
            >
              {loading ? '⏳ Logging in...' : '🚀 Login'}
            </Button>

            <div className="text-center">
              <Link 
                to="/forgot-password" 
                className="text-decoration-none"
                style={{ fontWeight: '500', fontSize: '1rem' }}
              >
                🔑 Forgot password?
              </Link>
            </div>
          </Form>

          <hr style={{ margin: '1.5rem 0' }} />

          <div className="text-center">
            <p className="mb-0" style={{ fontSize: '1rem' }}>
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-decoration-none"
                style={{ fontWeight: '600', fontSize: '1.05rem' }}
              >
                Register here
              </Link>
            </p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;

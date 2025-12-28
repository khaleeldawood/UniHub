import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import blogService from '../services/blogService';
import { BLOG_CATEGORIES } from '../utils/constants';

const CreateBlog = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: BLOG_CATEGORIES.ARTICLE,
    isGlobal: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Client-side validation
    if (formData.title.length < 3) {
      setError('Title must be at least 3 characters long');
      setLoading(false);
      return;
    }

    if (!formData.content.trim()) {
      setError('Content cannot be empty');
      setLoading(false);
      return;
    }

    try {
      await blogService.createBlog(formData);
      navigate('/my-blogs');
    } catch (err) {
      // Display specific backend error message
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        // Handle validation errors
        const errorMessages = Object.values(err.response.data.errors).join(', ');
        setError(errorMessages);
      } else if (err.response?.status === 401) {
        setError('You must be logged in to create a blog');
      } else if (err.response?.status === 403) {
        setError('You do not have permission to create blogs');
      } else {
        setError('Failed to create blog. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Card style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card.Header>
          <h3>📝 Create New Post</h3>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title *</Form.Label>
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
              <Form.Label>Category *</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value={BLOG_CATEGORIES.ARTICLE}>Article</option>
                <option value={BLOG_CATEGORIES.INTERNSHIP}>Internship</option>
                <option value={BLOG_CATEGORIES.JOB}>Job Opportunity</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Content *</Form.Label>
              <Form.Control
                as="textarea"
                rows={10}
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="isGlobal"
                label="Make this post visible globally (across all universities)"
                checked={formData.isGlobal}
                onChange={handleChange}
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button type="submit" variant="success" disabled={loading}>
                {loading ? 'Creating...' : 'Create Post'}
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateBlog;

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import blogService from '../services/blogService';
import { BLOG_CATEGORIES } from '../utils/constants';

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: BLOG_CATEGORIES.ARTICLE,
    isGlobal: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadBlog();
  }, [id]);

  const loadBlog = async () => {
    try {
      const blog = await blogService.getBlogById(id);
      
      // Check if user is the owner
      if (blog.author?.userId !== user.userId) {
        setError('You do not have permission to edit this blog');
        setLoading(false);
        return;
      }

      // Allow editing PENDING and APPROVED blogs
      if (blog.status !== 'PENDING' && blog.status !== 'APPROVED') {
        setError('Only pending or approved blogs can be edited');
        setLoading(false);
        return;
      }

      setFormData({
        title: blog.title || '',
        content: blog.content || '',
        category: blog.category || BLOG_CATEGORIES.ARTICLE,
        isGlobal: blog.isGlobal || false
      });
    } catch (err) {
      setError('Failed to load blog details');
    } finally {
      setLoading(false);
    }
  };

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
    setSaving(true);

    try {
      await blogService.updateBlog(id, formData);
      navigate('/my-blogs');
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to update blog. Please try again.');
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
        <Button variant="secondary" onClick={() => navigate('/my-blogs')}>
          Back to My Blogs
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Card style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card.Header>
          <h3>✏️ Edit Blog</h3>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {formData.title && new Date().getTime() > 0 && (
            <Alert variant="warning">
              ⚠️ <strong>Note:</strong> Editing an approved blog will reset its status to PENDING and require re-approval by a supervisor.
            </Alert>
          )}

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
              <Form.Label>Category *</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value={BLOG_CATEGORIES.ARTICLE}>📰 Article</option>
                <option value={BLOG_CATEGORIES.INTERNSHIP}>💼 Internship</option>
                <option value={BLOG_CATEGORIES.JOB}>🎯 Job Opportunity</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Check
                type="checkbox"
                name="isGlobal"
                label="🌍 Make this post visible to all universities"
                checked={formData.isGlobal}
                onChange={handleChange}
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button 
                type="submit" 
                variant="primary" 
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => navigate('/my-blogs')}
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

export default EditBlog;

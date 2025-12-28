import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Badge, Alert, Modal, Form } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import blogService from '../services/blogService';
import reportService from '../services/reportService';
import { formatDate, getStatusVariant } from '../utils/helpers';
import { USER_ROLES } from '../utils/constants';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportingBlog, setReportingBlog] = useState(false);

  useEffect(() => {
    loadBlogDetails();
  }, [id]);

  const loadBlogDetails = async () => {
    try {
      const blogData = await blogService.getBlogById(id);
      setBlog(blogData);
    } catch (err) {
      console.error('Failed to load blog details:', err);
      setError('Failed to load blog details');
    } finally {
      setLoading(false);
    }
  };

  const handleReportBlog = async () => {
    if (!reportReason.trim()) {
      setError('Please provide a reason for reporting');
      return;
    }
    
    setReportingBlog(true);
    try {
      await reportService.reportBlog(id, reportReason);
      setSuccess('Blog reported successfully. Our team will review it.');
      setShowReportModal(false);
      setReportReason('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to report blog');
    } finally {
      setReportingBlog(false);
    }
  };

  const handleAdminDelete = async () => {
    if (!window.confirm('⚠️ Admin Action: Are you sure you want to delete this blog?')) {
      return;
    }
    
    try {
      await blogService.deleteBlog(id);
      setSuccess('Blog deleted successfully');
      setTimeout(() => navigate('/blogs'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete blog');
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" />
      </Container>
    );
  }

  if (!blog) {
    return (
      <Container className="py-5">
        <Alert variant="danger">Blog not found</Alert>
        <Button as={Link} to="/blogs" variant="primary">Back to Blogs</Button>
      </Container>
    );
  }

  const canReportBlog = user && blog.author?.userId !== user.userId && (blog.status === 'PENDING' || blog.status === 'APPROVED');

  return (
    <Container className="py-4">
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      <div className="mb-3">
        <Button as={Link} to="/blogs" variant="outline-secondary" size="sm">
          ← Back to Blogs
        </Button>
      </div>

      <Card className="mb-4">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h2 className="mb-2">{blog.title}</h2>
              <div className="d-flex gap-2 flex-wrap">
                <Badge bg="info">{blog.category}</Badge>
                {blog.isGlobal && <Badge bg="warning">🌍 Global</Badge>}
                <Badge bg={getStatusVariant(blog.status)}>{blog.status}</Badge>
              </div>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="mb-3">
            <strong>✍️ Author:</strong> {blog.author?.name}
            {blog.author?.university && (
              <span className="text-muted"> • {blog.author.university.name}</span>
            )}
          </div>
          <div className="mb-3">
            <strong>📅 Published:</strong> {formatDate(blog.createdAt)}
          </div>
          {blog.lastModifiedAt && (
            <div className="mb-3">
              <strong>🔄 Last Updated:</strong> {formatDate(blog.lastModifiedAt)}
            </div>
          )}
          <hr />
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
            {blog.content}
          </div>
        </Card.Body>
      </Card>

      {/* Action Buttons */}
      <div className="d-flex gap-2 flex-wrap mb-4">
        {/* Edit button for author */}
        {user && blog.author?.userId === user.userId && (
          <Button 
            as={Link} 
            to={`/blogs/${blog.blogId}/edit`}
            variant="warning"
          >
            ✏️ Edit Blog
          </Button>
        )}

        {/* Report button */}
        {canReportBlog && (
          <Button 
            variant="outline-danger"
            onClick={() => setShowReportModal(true)}
          >
            🚨 Report Blog
          </Button>
        )}

        {/* Admin delete */}
        {user && user.role === USER_ROLES.ADMIN && (
          <Button 
            variant="danger"
            onClick={handleAdminDelete}
          >
            🗑️ Delete (Admin)
          </Button>
        )}
      </div>

      {/* Report Modal */}
      <Modal show={showReportModal} onHide={() => setShowReportModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Report Blog</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted">You are reporting: <strong>{blog.title}</strong></p>
          <Form.Group>
            <Form.Label>Reason for reporting</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Please explain why you are reporting this blog..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReportModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleReportBlog}
            disabled={reportingBlog}
          >
            {reportingBlog ? 'Reporting...' : 'Submit Report'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BlogDetails;

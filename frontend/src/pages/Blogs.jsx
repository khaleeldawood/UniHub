import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Form, Modal, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import blogService from '../services/blogService';
import reportService from '../services/reportService';
import { truncateText, getStatusVariant } from '../utils/helpers';
import { BLOG_STATUS, BLOG_CATEGORIES, USER_ROLES } from '../utils/constants';
import ConfirmationModal from '../components/common/ConfirmationModal';

const Blogs = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [filters, setFilters] = useState({
    status: user && (user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.SUPERVISOR) ? '' : 'APPROVED',
    category: '',
    search: ''
  });
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [reportingBlog, setReportingBlog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const isModerator = user && (user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.SUPERVISOR);

  useEffect(() => {
    loadBlogs();
  }, [filters.status, filters.category]);

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const filterParams = {
        status: filters.status || undefined,
        category: filters.category || undefined
      };
      let data = await blogService.getAllBlogs(filterParams);
      
      // Role-based filtering for students
      if (user && user.role === USER_ROLES.STUDENT) {
        // Students see approved blogs + their own blogs in any state
        data = Array.isArray(data) ? data.filter(blog => 
          blog.status === 'APPROVED' || blog.author?.userId === user.userId
        ) : [];
      }
      
      setBlogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load blogs:', error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminDelete = async () => {
    setIsProcessing(true);
    try {
      await blogService.deleteBlog(selectedBlog.blogId);
      setBlogs(blogs.filter(b => b.blogId !== selectedBlog.blogId));
      setShowDeleteModal(false);
      setSelectedBlog(null);
    } catch (error) {
      alert('Failed to delete blog: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReportBlog = async () => {
    if (!reportReason.trim()) {
      setError('Please provide a reason for reporting');
      return;
    }
    
    setReportingBlog(true);
    try {
      await reportService.reportBlog(selectedBlog.blogId, reportReason);
      setSuccess('Blog reported successfully. Our team will review it.');
      setShowReportModal(false);
      setReportReason('');
      setSelectedBlog(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to report blog');
    } finally {
      setReportingBlog(false);
    }
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(filters.search.toLowerCase()) ||
    blog.content.toLowerCase().includes(filters.search.toLowerCase())
  );

  return (
    <Container className="py-4" style={{ marginTop: '100px' }}>
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}
      
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2>📝 Blogs & Opportunities</h2>
            {user && (
              <Button as={Link} to="/blogs/new" variant="success">
                Create Post
              </Button>
            )}
          </div>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="blogs-filters mb-4" style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
        <Card.Body>
          <h5 className="mb-3">🔍 Filters</h5>
          <Row className="g-3">
            {user && (user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.SUPERVISOR) && (
              <Col md={3}>
                <Form.Label style={{ fontWeight: '600', fontSize: '0.95rem' }}>Status</Form.Label>
                <Form.Select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  style={{ border: '2px solid #dee2e6', borderRadius: '0.5rem' }}
                >
                  <option value="">All Status</option>
                  <option value={BLOG_STATUS.APPROVED}>✅ Approved</option>
                  <option value={BLOG_STATUS.PENDING}>⏳ Pending</option>
                  <option value={BLOG_STATUS.REJECTED}>❌ Rejected</option>
                </Form.Select>
              </Col>
            )}
            <Col md={3}>
              <Form.Label style={{ fontWeight: '600', fontSize: '0.95rem' }}>Category</Form.Label>
              <Form.Select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                style={{ border: '2px solid #dee2e6', borderRadius: '0.5rem' }}
              >
                <option value="">All Categories</option>
                <option value={BLOG_CATEGORIES.ARTICLE}>📰 Article</option>
                <option value={BLOG_CATEGORIES.INTERNSHIP}>💼 Internship</option>
                <option value={BLOG_CATEGORIES.JOB}>🎯 Job</option>
              </Form.Select>
            </Col>
            <Col md={user && (user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.SUPERVISOR) ? 6 : 9}>
              <Form.Label style={{ fontWeight: '600', fontSize: '0.95rem' }}>Search</Form.Label>
              <Form.Control
                type="text"
                placeholder="🔎 Search blogs by title or content..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                style={{ border: '2px solid #dee2e6', borderRadius: '0.5rem' }}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Blogs List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
        </div>
      ) : (
        <Row className="g-3">
          {filteredBlogs.map(blog => (
            <Col xs={12} sm={6} lg={4} key={blog.blogId}>
              <Card className="blogs h-100" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', border: '1px solid var(--border-color)', minHeight: '320px', position: 'relative', overflow: 'hidden' }}>
                {blog.reportCount > 0 && (
                  <div style={{
                    position: 'absolute',
                    bottom: '5px',
                    right: '5px',
                    width: '28px',
                    height: '28px',
                    backgroundColor: '#dc3545',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    zIndex: 10,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}>
                    {blog.reportCount}
                  </div>
                )}
                <Card.Body>
                  <div className="mb-2 d-flex flex-wrap gap-1">
                    <Badge bg="info">{blog.category}</Badge>
                    {blog.isGlobal && <Badge bg="warning">🌍 Global</Badge>}
                    <Badge bg={getStatusVariant(blog.status)}>{blog.status}</Badge>
                  </div>
                  <Card.Title style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>{blog.title}</Card.Title>
                  <Card.Text style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{truncateText(blog.content, 150)}</Card.Text>
                  <div className="text-muted small mb-3">
                    ✍️ By: <strong>{blog.author?.name}</strong>
                  </div>
                  <div className="d-flex gap-2 flex-wrap">
                    <Button 
                      as={Link}
                      to={`/blogs/${blog.blogId}`}
                      variant="outline-primary" 
                      size="sm" 
                      style={{ fontWeight: '600', width: 'fit-content' }}
                    >
                      Read More
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal show={showReportModal} onHide={() => setShowReportModal(false)}>
        <Modal.Header closeButton style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <Modal.Title style={{ color: 'var(--text-primary)' }}>Report Blog</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
          <p className="text-muted">You are reporting: <strong style={{ color: 'var(--text-primary)' }}>{selectedBlog?.title}</strong></p>
          <Form.Group>
            <Form.Label style={{ color: 'var(--text-primary)' }}>Reason for reporting</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Please explain why you are reporting this blog..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
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

      <ConfirmationModal
        show={showDeleteModal}
        onHide={() => { setShowDeleteModal(false); setSelectedBlog(null); }}
        onConfirm={handleAdminDelete}
        title="Delete Blog"
        message="Are you sure you want to delete this blog?"
        itemName={selectedBlog?.title}
        confirmText="Delete"
        confirmVariant="danger"
        isLoading={isProcessing}
      />
    </Container>
  );
};

export default Blogs;

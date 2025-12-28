import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Badge, Alert } from 'react-bootstrap';
import blogService from '../services/blogService';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES } from '../utils/constants';

const BlogApprovals = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingBlogs();
  }, []);

  const loadPendingBlogs = async () => {
    try {
      const data = await blogService.getPendingBlogs();
      setBlogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load pending blogs:', error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await blogService.approveBlog(id);
      loadPendingBlogs();
    } catch (error) {
      console.error('Failed to approve blog:', error);
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Rejection reason:');
    if (!reason) return;
    try {
      await blogService.rejectBlog(id, reason);
      loadPendingBlogs();
    } catch (error) {
      console.error('Failed to reject blog:', error);
    }
  };

  return (
    <Container className="py-4">
      <Alert variant="warning" style={{ fontWeight: '500', border: '2px solid #ffc107', boxShadow: '0 2px 8px rgba(255, 193, 7, 0.2)' }}>
        <strong>👨‍🏫 {user.role === USER_ROLES.ADMIN ? 'Admin' : 'Supervisor'} View:</strong> Review and approve/reject pending blogs and opportunities from your university.
      </Alert>
      <h2 className="mb-4" style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)' }}>⏳ Blog Approvals</h2>
      <Card style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', border: 'none', borderRadius: '1rem' }}>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
          ) : blogs.length > 0 ? (
            <Table responsive hover>
              <thead style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <tr>
                  <th style={{ fontWeight: '600', padding: '1rem' }}>Title</th>
                  <th style={{ fontWeight: '600', padding: '1rem' }}>Author</th>
                  <th style={{ fontWeight: '600', padding: '1rem' }}>Category</th>
                  <th style={{ fontWeight: '600', padding: '1rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map(blog => (
                  <tr key={blog.blogId} style={{ borderLeft: '4px solid #ffc107' }}>
                    <td style={{ fontWeight: '500', padding: '1rem' }}>{blog.title}</td>
                    <td style={{ padding: '1rem' }}>
                      <div><strong>{blog.author?.name}</strong></div>
                      <div className="text-muted small">{blog.author?.email}</div>
                    </td>
                    <td style={{ padding: '1rem' }}><Badge bg="info" style={{ fontSize: '0.85rem', fontWeight: '600' }}>{blog.category}</Badge></td>
                    <td style={{ padding: '1rem' }}>
                      <div className="d-flex gap-2">
                        <Button 
                          size="sm" 
                          variant="success" 
                          onClick={() => handleApprove(blog.blogId)}
                          style={{ fontWeight: '600', minWidth: '90px' }}
                        >
                          ✅ Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="danger" 
                          onClick={() => handleReject(blog.blogId)}
                          style={{ fontWeight: '600', minWidth: '90px' }}
                        >
                          ❌ Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center py-5">
              <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: '0.3' }}>✅</div>
              <h4 style={{ color: '#6c757d', fontWeight: '600' }}>All Clear!</h4>
              <p className="text-muted">No pending blog approvals at the moment.</p>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BlogApprovals;

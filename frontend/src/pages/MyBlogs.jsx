import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, Table, Badge, Button } from 'react-bootstrap';
import blogService from '../services/blogService';
import { getStatusVariant } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES } from '../utils/constants';

const MyBlogs = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyBlogs();
  }, []);

  const loadMyBlogs = async () => {
    try {
      const data = await blogService.getMyBlogs();
      setBlogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load blogs:', error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return;
    }
    
    try {
      await blogService.deleteBlog(blogId);
      setBlogs(blogs.filter(b => b.blogId !== blogId));
    } catch (error) {
      alert('Failed to delete blog: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">📝 My Blogs</h2>
      <Card>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
          ) : blogs.length > 0 ? (
            <Table responsive hover>
              <thead>
                <tr><th>Title</th><th>Category</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {blogs.map(blog => (
                  <tr key={blog.blogId}>
                    <td style={{ fontWeight: '500' }}>{blog.title}</td>
                    <td><Badge bg="info" style={{ fontSize: '0.85rem', fontWeight: '600' }}>{blog.category}</Badge></td>
                    <td><Badge bg={getStatusVariant(blog.status)} style={{ fontSize: '0.85rem', fontWeight: '600' }}>{blog.status}</Badge></td>
                    <td>
                      <div className="d-flex gap-2">
                        {/* Edit button for PENDING and APPROVED blogs */}
                        {(blog.status === 'PENDING' || blog.status === 'APPROVED') && (
                          <Button 
                            as={Link}
                            to={`/blogs/${blog.blogId}/edit`}
                            size="sm" 
                            variant="outline-info"
                            title={blog.status === 'APPROVED' ? 'Edit (will reset to PENDING)' : 'Edit blog'}
                          >
                            ✏️ Edit
                          </Button>
                        )}
                        
                        {/* Only allow deletion for PENDING or REJECTED blogs */}
                        {(blog.status === 'PENDING' || blog.status === 'REJECTED') && (
                          <Button 
                            size="sm" 
                            variant="outline-danger"
                            onClick={() => handleDelete(blog.blogId)}
                            title="Delete blog"
                          >
                            🗑️ Delete
                          </Button>
                        )}
                        
                        {/* Admins can delete any blog */}
                        {user.role === USER_ROLES.ADMIN && blog.status === 'APPROVED' && (
                          <Button 
                            size="sm" 
                            variant="danger"
                            onClick={() => handleDelete(blog.blogId)}
                            title="Delete blog (Admin)"
                          >
                            🗑️ Delete
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center text-muted py-5">No blogs created yet</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default MyBlogs;

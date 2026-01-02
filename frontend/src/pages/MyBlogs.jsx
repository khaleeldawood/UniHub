import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Card, Table, Badge, Button } from 'react-bootstrap';
import blogService from '../services/blogService';
import { getStatusVariant } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES } from '../utils/constants';
import ConfirmationModal from '../components/common/ConfirmationModal';

const MyBlogs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleDelete = async () => {
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
                  <tr key={blog.blogId} style={{ cursor: 'pointer' }} onClick={() => navigate(`/blogs/${blog.blogId}`)}>
                    <td style={{ fontWeight: '500' }}>{blog.title}</td>
                    <td><Badge bg="info" style={{ fontSize: '0.85rem', fontWeight: '600' }}>{blog.category}</Badge></td>
                    <td><Badge bg={getStatusVariant(blog.status)} style={{ fontSize: '0.85rem', fontWeight: '600' }}>{blog.status}</Badge></td>
                    <td>
                      <div className="d-flex gap-2" onClick={(e) => e.stopPropagation()}>
                        {/* View Details */}
                        <Button 
                          as={Link}
                          to={`/blogs/${blog.blogId}`}
                          size="sm" 
                          variant="outline-primary"
                          title="View details"
                        >
                          View
                        </Button>
                        
                        {/* Edit button for PENDING and APPROVED blogs */}
                        {(blog.status === 'PENDING' || blog.status === 'APPROVED') && (
                          <Button 
                            as={Link}
                            to={`/blogs/${blog.blogId}/edit`}
                            size="sm" 
                            variant="outline-info"
                            title={blog.status === 'APPROVED' ? 'Edit (will reset to PENDING)' : 'Edit blog'}
                          >
                            Edit
                          </Button>
                        )}
                        
                        {/* Only allow deletion for PENDING or REJECTED blogs */}
                        {(blog.status === 'PENDING' || blog.status === 'REJECTED') && (
                          <Button 
                            size="sm" 
                            variant="danger"
                            onClick={() => { setSelectedBlog(blog); setShowDeleteModal(true); }}
                            title="Delete blog"
                          >
                            Delete
                          </Button>
                        )}
                        
                        {/* Admins can delete any blog */}
                        {user.role === USER_ROLES.ADMIN && blog.status === 'APPROVED' && (
                          <Button 
                            size="sm" 
                            variant="danger"
                            onClick={() => { setSelectedBlog(blog); setShowDeleteModal(true); }}
                            title="Delete blog (Admin)"
                          >
                            Delete
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

      <ConfirmationModal
        show={showDeleteModal}
        onHide={() => { setShowDeleteModal(false); setSelectedBlog(null); }}
        onConfirm={handleDelete}
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

export default MyBlogs;

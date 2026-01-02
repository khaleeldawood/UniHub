import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import adminService from '../services/adminService';
import ConfirmationModal from '../components/common/ConfirmationModal';

const AdminUniversities = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', logoUrl: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [universityToDelete, setUniversityToDelete] = useState(null);

  useEffect(() => {
    loadUniversities();
  }, []);

  const loadUniversities = async () => {
    try {
      const data = await adminService.getUniversities();
      setUniversities(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load universities:', error);
      setUniversities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUniversity = (uni) => {
    setSelectedUniversity(uni);
    setEditForm({ name: uni.name, description: uni.description, logoUrl: uni.logoUrl || '' });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    setError('');
    try {
      await adminService.updateUniversity(selectedUniversity.universityId, editForm);
      setSuccess('University updated successfully');
      setShowEditModal(false);
      loadUniversities();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update university');
    }
  };

  const handleAddUniversity = async () => {
    setError('');
    try {
      await adminService.createUniversity(editForm);
      setSuccess('University added successfully');
      setShowAddModal(false);
      setEditForm({ name: '', description: '', logoUrl: '' });
      loadUniversities();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add university');
    }
  };

  const handleDeleteUniversity = async () => {
    try {
      await adminService.deleteUniversity(universityToDelete.universityId);
      setSuccess('University deleted successfully');
      setShowDeleteModal(false);
      setUniversityToDelete(null);
      loadUniversities();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete university');
      setShowDeleteModal(false);
    }
  };

  return (
    <Container className="py-4">
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🏫 University Management</h2>
        <Button variant="outline-primary" onClick={() => { setEditForm({ name: '', description: '', logoUrl: '' }); setShowAddModal(true); }}>
          Add University
        </Button>
      </div>

      <Card>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {universities.map(uni => (
                  <tr key={uni.universityId}>
                    <td><strong>{uni.name}</strong></td>
                    <td>{uni.description}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline-primary"
                          onClick={() => handleEditUniversity(uni)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline-danger"
                          onClick={() => { setUniversityToDelete(uni); setShowDeleteModal(true); }}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Edit University Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <Modal.Title style={{ color: 'var(--text-primary)' }}>Edit University</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
          <Form.Group className="mb-3">
            <Form.Label>University Name</Form.Label>
            <Form.Control
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Logo URL</Form.Label>
            <Form.Control
              type="text"
              value={editForm.logoUrl || ''}
              onChange={(e) => setEditForm({ ...editForm, logoUrl: e.target.value })}
              placeholder="https://example.com/logo.png"
            />
            <Form.Text className="text-muted">
              Optional: URL to university logo image
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add University Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <Modal.Title style={{ color: 'var(--text-primary)' }}>Add New University</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
          <Form.Group className="mb-3">
            <Form.Label>University Name</Form.Label>
            <Form.Control
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              placeholder="Optional description..."
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Logo URL</Form.Label>
            <Form.Control
              type="text"
              value={editForm.logoUrl || ''}
              onChange={(e) => setEditForm({ ...editForm, logoUrl: e.target.value })}
              placeholder="https://example.com/logo.png"
              required
            />
            <Form.Text className="text-muted">
              Required: URL to university logo image
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddUniversity}>
            Add University
          </Button>
        </Modal.Footer>
      </Modal>

      <ConfirmationModal
        show={showDeleteModal}
        onHide={() => { setShowDeleteModal(false); setUniversityToDelete(null); }}
        onConfirm={handleDeleteUniversity}
        title="Delete University"
        message="Are you sure you want to delete this university? This action cannot be undone."
        itemName={universityToDelete?.name}
        confirmText="Delete"
        confirmVariant="danger"
      />
    </Container>
  );
};

export default AdminUniversities;

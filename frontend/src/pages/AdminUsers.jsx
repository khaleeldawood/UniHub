import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Badge, Modal, Form, Alert } from 'react-bootstrap';
import adminService from '../services/adminService';
import { USER_ROLES } from '../utils/constants';
import ConfirmationModal from '../components/common/ConfirmationModal';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({ role: '', points: 0 });
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    password: '',
    universityId: ''
  });
  const [universities, setUniversities] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    loadUsers();
    loadUniversities();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await adminService.getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const loadUniversities = async () => {
    try {
      const data = await adminService.getUniversities();
      setUniversities(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load universities:', error);
      setUniversities([]);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditForm({ role: user.role, points: user.points });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    setError('');
    try {
      await adminService.updateUser(selectedUser.userId, editForm);
      setSuccess('User updated successfully');
      setShowEditModal(false);
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async () => {
    try {
      await adminService.deleteUser(userToDelete.userId);
      setSuccess('User deleted successfully');
      setShowDeleteModal(false);
      setUserToDelete(null);
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
      setShowDeleteModal(false);
    }
  };

  const handleCreateSupervisor = async () => {
    setError('');
    try {
      await adminService.createUser({
        ...newUserForm,
        role: USER_ROLES.SUPERVISOR,
        universityId: newUserForm.universityId || null
      });
      setSuccess('Supervisor created successfully');
      setShowAddModal(false);
      setNewUserForm({ name: '', email: '', password: '', universityId: '' });
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create supervisor');
    }
  };

  return (
    <Container className="py-4">
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>👥 User Management</h2>
        <Button variant="outline-primary" onClick={() => setShowAddModal(true)}>
          Add Supervisor
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
                  <th>Email</th>
                  <th>University</th>
                  <th>Role</th>
                  <th>Points</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.userId}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.university?.name || 'N/A'}</td>
                    <td>
                      <Badge bg={
                        user.role === 'ADMIN' ? 'danger' :
                        user.role === 'SUPERVISOR' ? 'warning' : 'primary'
                      }>
                        {user.role}
                      </Badge>
                    </td>
                    <td>{user.points}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline-primary"
                          onClick={() => handleEditUser(user)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline-danger"
                          onClick={() => { setUserToDelete(user); setShowDeleteModal(true); }}
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

      {/* Add Supervisor Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <Modal.Title style={{ color: 'var(--text-primary)' }}>Add Supervisor</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              value={newUserForm.name}
              onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={newUserForm.email}
              onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Temporary Password</Form.Label>
            <Form.Control
              type="password"
              value={newUserForm.password}
              onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>University</Form.Label>
            <Form.Select
              value={newUserForm.universityId}
              onChange={(e) => setNewUserForm({ ...newUserForm, universityId: e.target.value })}
            >
              <option value="">No University</option>
              {universities.map((uni) => (
                <option key={uni.universityId} value={uni.universityId}>
                  {uni.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateSupervisor}>
            Create Supervisor
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <Modal.Title style={{ color: 'var(--text-primary)' }}>Edit User: {selectedUser?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select
              value={editForm.role}
              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
            >
              <option value={USER_ROLES.STUDENT}>Student</option>
              <option value={USER_ROLES.SUPERVISOR}>Supervisor</option>
              <option value={USER_ROLES.ADMIN}>Admin</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Points</Form.Label>
            <Form.Control
              type="number"
              value={editForm.points}
              onChange={(e) => setEditForm({ ...editForm, points: parseInt(e.target.value) })}
              min="0"
            />
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

      <ConfirmationModal
        show={showDeleteModal}
        onHide={() => { setShowDeleteModal(false); setUserToDelete(null); }}
        onConfirm={handleDeleteUser}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        itemName={userToDelete?.name}
        confirmText="Delete"
        confirmVariant="danger"
      />
    </Container>
  );
};

export default AdminUsers;

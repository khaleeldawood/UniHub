import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmationModal = ({ show, onHide, onConfirm, title, message, itemName, confirmText = 'Delete', confirmVariant = 'danger', isLoading = false }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        <Modal.Title style={{ color: 'var(--text-primary)' }}>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
        <p>{message}</p>
        {itemName && (
          <p className="mb-0">
            <strong style={{ color: 'var(--text-primary)' }}>{itemName}</strong>
          </p>
        )}
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        <Button variant="secondary" onClick={onHide} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant={confirmVariant} onClick={onConfirm} disabled={isLoading}>
          {isLoading ? 'Processing...' : confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;

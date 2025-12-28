import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { getBadgeColor } from '../../utils/helpers';

const BadgeModal = ({ badge, show, onHide }) => {
  if (!badge) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>🎉 Congratulations!</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center py-4">
        <div className="mb-4">
          <div 
            className={`badge bg-${getBadgeColor(badge.badgeName)} fs-1 p-4 rounded-circle`}
            style={{ width: '120px', height: '120px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          >
            🏆
          </div>
        </div>
        <h3 className="mb-3">{badge.badgeName}</h3>
        <p className="text-muted mb-3">{badge.badgeDescription}</p>
        <div className="alert alert-success">
          <strong>Points Required:</strong> {badge.pointsThreshold}
        </div>
        <p className="mb-0">
          You've earned the <strong>{badge.badgeName}</strong> badge!
          Keep up the great work! 🌟
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onHide}>
          Awesome! 🎊
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BadgeModal;

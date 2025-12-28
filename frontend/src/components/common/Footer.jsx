import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-auto py-4" style={{ boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.15)' }}>
      <Container>
        <Row className="align-items-center">
          <Col md={4} className="text-center text-md-start mb-2 mb-md-0">
            <h6 className="mb-1" style={{ fontWeight: '700', fontSize: '1.1rem' }}>🎓 UniHub</h6>
            <p className="mb-0 small" style={{ fontSize: '0.85rem' }}>
              Connect, Create, Participate
            </p>
          </Col>
          
          <Col md={4} className="text-center mb-2 mb-md-0">
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link" title="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link" title="Twitter">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link" title="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link" title="LinkedIn">
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link" title="GitHub">
                <i className="bi bi-github"></i>
              </a>
            </div>
          </Col>
          
          <Col md={4} className="text-center text-md-end">
            <p className="mb-0 small" style={{ fontSize: '0.85rem' }}>
              © 2025 UniHub. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-main">
      <Container>
        <Row className="footer-content">
          {/* Brand Section */}
          <Col lg={4} md={12} className="mb-4">
            <div className="footer-brand">
              <h5 className="footer-logo">🎓 UniHub</h5>
              <p className="footer-description">
                Empowering university communities through engagement, collaboration, and growth.
              </p>
            </div>
          </Col>

          {/* Quick Links */}
          <Col lg={2} md={4} sm={6} className="mb-4">
            <h6 className="footer-heading">Quick Links</h6>
            <ul className="footer-links">
              <li><Link to="/about">About</Link></li>
              <li><Link to="/features">Features</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </Col>

          {/* Legal */}
          <Col lg={2} md={4} sm={6} className="mb-4">
            <h6 className="footer-heading">Legal</h6>
            <ul className="footer-links">
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service">Terms of Service</Link></li>
              <li><Link to="/cookie-policy">Cookie Policy</Link></li>
              <li><Link to="/guidelines">Guidelines</Link></li>
            </ul>
          </Col>

          {/* Support */}
          <Col lg={2} md={4} sm={6} className="mb-4">
            <h6 className="footer-heading">Support</h6>
            <ul className="footer-links">
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/support">Support</Link></li>
            </ul>
          </Col>

          {/* Social */}
          <Col lg={2} md={12} className="mb-4">
            <h6 className="footer-heading">Follow Us</h6>
            <div className="footer-social">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon" title="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon" title="Twitter">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon" title="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon" title="LinkedIn">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </Col>
        </Row>

        {/* Copyright */}
        <Row className="footer-bottom">
          <Col className="text-center">
            <p className="copyright-text">
              © 2025 UniHub. All rights reserved. Built with ❤️ for university communities.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

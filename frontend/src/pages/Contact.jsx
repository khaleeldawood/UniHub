import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';

const Contact = () => {
  return (
    <Container className="py-5">
      <Card style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Card.Body className="p-5 text-center">
          <div style={{ fontSize: '4rem' }}>📧</div>
          <h1 className="mb-4">Contact Us</h1>
          <p className="lead text-muted mb-4">Have questions or need support? We're here to help!</p>
          
          <div className="mb-4">
            <h5>Email</h5>
            <a href="mailto:unihubplat@gmail.com" style={{ fontSize: '1.2rem', color: 'var(--primary-color)' }}>
              unihubplat@gmail.com
            </a>
          </div>

          <Button 
            variant="primary" 
            size="lg"
            href="mailto:unihubplat@gmail.com"
          >
            Send Email
          </Button>

          <div className="mt-5 text-muted">
            <p className="mb-1">We typically respond within 24-48 hours</p>
            <p>Monday - Friday, 9:00 AM - 5:00 PM</p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Contact;

import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';

const Support = () => {
  return (
    <Container className="py-5">
      <Card style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Card.Body className="p-5 text-center">
          <div style={{ fontSize: '4rem' }}>🆘</div>
          <h1 className="mb-4">Support</h1>
          <p className="lead text-muted mb-4">Need technical assistance or have an issue?</p>
          
          <div className="mb-4">
            <h5>Support Email</h5>
            <a href="mailto:unihubplat@gmail.com" style={{ fontSize: '1.2rem', color: 'var(--primary-color)' }}>
              unihubplat@gmail.com
            </a>
          </div>

          <Button 
            variant="primary" 
            size="lg"
            href="mailto:unihubplat@gmail.com?subject=Support Request"
          >
            Request Support
          </Button>

          <div className="mt-5">
            <h5>Before contacting support:</h5>
            <ul className="text-start" style={{ maxWidth: '400px', margin: '1rem auto', color: 'var(--text-primary)' }}>
              <li>Check the FAQ page</li>
              <li>Review the Guidelines</li>
              <li>Try refreshing the page</li>
              <li>Clear your browser cache</li>
            </ul>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Support;

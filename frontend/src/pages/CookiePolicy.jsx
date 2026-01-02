import React from 'react';
import { Container, Card } from 'react-bootstrap';

const CookiePolicy = () => {
  return (
    <Container className="py-5">
      <Card style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Card.Body className="p-5">
          <h1 className="mb-4">🍪 Cookie Policy</h1>
          <p className="text-muted mb-4">Last updated: January 2025</p>

          <h4 className="mt-4">1. What Are Cookies</h4>
          <p>Cookies are small text files stored on your device to help us provide and improve our services.</p>

          <h4 className="mt-4">2. How We Use Cookies</h4>
          <p>We use cookies for authentication, remembering preferences, and analyzing site usage.</p>

          <h4 className="mt-4">3. Types of Cookies</h4>
          <p><strong>Essential Cookies:</strong> Required for authentication and security.</p>
          <p><strong>Preference Cookies:</strong> Remember your settings like theme preferences.</p>
          <p><strong>Analytics Cookies:</strong> Help us understand how you use the platform.</p>

          <h4 className="mt-4">4. Managing Cookies</h4>
          <p>You can control cookies through your browser settings, but disabling essential cookies may affect functionality.</p>

          <h4 className="mt-4">5. Contact</h4>
          <p>Questions about cookies? Email <a href="mailto:unihubplat@gmail.com">unihubplat@gmail.com</a></p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CookiePolicy;

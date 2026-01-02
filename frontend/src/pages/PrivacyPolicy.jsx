import React from 'react';
import { Container, Card } from 'react-bootstrap';

const PrivacyPolicy = () => {
  return (
    <Container className="py-5">
      <Card style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Card.Body className="p-5">
          <h1 className="mb-4">🔒 Privacy Policy</h1>
          <p className="text-muted mb-4">Last updated: January 2025</p>

          <h4 className="mt-4">1. Information We Collect</h4>
          <p>We collect information you provide when registering, including name, email, and university affiliation.</p>

          <h4 className="mt-4">2. How We Use Your Information</h4>
          <p>Your information is used to provide and improve our services, send notifications, and personalize your experience.</p>

          <h4 className="mt-4">3. Data Security</h4>
          <p>We implement security measures to protect your personal information, including encrypted passwords and secure connections.</p>

          <h4 className="mt-4">4. Sharing Information</h4>
          <p>We do not sell or share your personal information with third parties except as required by law.</p>

          <h4 className="mt-4">5. Your Rights</h4>
          <p>You have the right to access, update, or delete your personal information at any time through your account settings.</p>

          <h4 className="mt-4">6. Contact Us</h4>
          <p>For privacy concerns, contact us at <a href="mailto:unihubplat@gmail.com">unihubplat@gmail.com</a></p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PrivacyPolicy;

import React from 'react';
import { Container, Card } from 'react-bootstrap';

const TermsOfService = () => {
  return (
    <Container className="py-5">
      <Card style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Card.Body className="p-5">
          <h1 className="mb-4">📜 Terms of Service</h1>
          <p className="text-muted mb-4">Last updated: January 2025</p>

          <h4 className="mt-4">1. Acceptance of Terms</h4>
          <p>By accessing UniHub, you agree to be bound by these Terms of Service and all applicable laws.</p>

          <h4 className="mt-4">2. User Accounts</h4>
          <p>You are responsible for maintaining the confidentiality of your account credentials and all activities under your account.</p>

          <h4 className="mt-4">3. User Conduct</h4>
          <p>You agree not to post inappropriate content, harass other users, or violate community guidelines.</p>

          <h4 className="mt-4">4. Content Ownership</h4>
          <p>You retain ownership of content you post, but grant UniHub a license to display and distribute it on the platform.</p>

          <h4 className="mt-4">5. Termination</h4>
          <p>We reserve the right to suspend or terminate accounts that violate these terms.</p>

          <h4 className="mt-4">6. Limitation of Liability</h4>
          <p>UniHub is provided "as is" without warranties. We are not liable for any damages arising from use of the platform.</p>

          <h4 className="mt-4">7. Contact</h4>
          <p>For questions about these terms, contact <a href="mailto:unihubplat@gmail.com">unihubplat@gmail.com</a></p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TermsOfService;

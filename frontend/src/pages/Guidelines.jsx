import React from 'react';
import { Container, Card } from 'react-bootstrap';

const Guidelines = () => {
  return (
    <Container className="py-5">
      <Card style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Card.Body className="p-5">
          <h1 className="mb-4">📋 Community Guidelines</h1>
          <p className="text-muted mb-4">Last updated: January 2025</p>

          <h4 className="mt-4">1. Be Respectful</h4>
          <p>Treat all community members with respect. No harassment, hate speech, or discrimination.</p>

          <h4 className="mt-4">2. Keep Content Appropriate</h4>
          <p>Post content relevant to university activities. No spam, explicit content, or misinformation.</p>

          <h4 className="mt-4">3. Protect Privacy</h4>
          <p>Do not share personal information of others without consent.</p>

          <h4 className="mt-4">4. Academic Integrity</h4>
          <p>Do not promote cheating, plagiarism, or academic dishonesty.</p>

          <h4 className="mt-4">5. Report Violations</h4>
          <p>Use the report feature to flag inappropriate content or behavior.</p>

          <h4 className="mt-4">6. Consequences</h4>
          <p>Violations may result in content removal, point penalties, or account suspension.</p>

          <h4 className="mt-4">7. Questions</h4>
          <p>Contact us at <a href="mailto:unihubplat@gmail.com">unihubplat@gmail.com</a> for clarification.</p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Guidelines;

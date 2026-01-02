import React from 'react';
import { Container, Accordion } from 'react-bootstrap';

const FAQ = () => {
  const faqs = [
    { q: 'What is UniHub?', a: 'UniHub is a comprehensive university portal platform that connects students, faculty, and administrators through events, blogs, and gamification features.' },
    { q: 'How do I earn points?', a: 'You earn points by participating in events as an organizer, volunteer, or attendee. Each role has different point values.' },
    { q: 'What are badges?', a: 'Badges are achievements you unlock by reaching certain milestones, such as attending events or writing blogs.' },
    { q: 'How do I create an event?', a: 'Navigate to Events page and click "Create Event". Fill in the details and submit for approval.' },
    { q: 'Who can approve events?', a: 'Events are approved by supervisors or administrators.' },
    { q: 'Can I edit my blog after publishing?', a: 'Yes, you can edit pending or approved blogs, but editing an approved blog will reset it to pending status.' }
  ];

  return (
    <>
      <style>
        {`
          @keyframes gradientMove { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
          .animated-bg { background: linear-gradient(-45deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1), rgba(6, 182, 212, 0.1)); background-size: 400% 400%; animation: gradientMove 15s ease infinite; min-height: 100vh; }
        `}
      </style>
      <div className="animated-bg">
        <Container className="py-5">
          <div className="text-center mb-5">
            <h1 className="mb-3">❓ Frequently Asked Questions</h1>
            <p className="lead text-muted">Find answers to common questions</p>
          </div>

          <Accordion defaultActiveKey="0" style={{ maxWidth: '800px', margin: '0 auto' }}>
            {faqs.map((faq, index) => (
              <Accordion.Item key={index} eventKey={index.toString()}>
                <Accordion.Header>{faq.q}</Accordion.Header>
                <Accordion.Body>{faq.a}</Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Container>
      </div>
    </>
  );
};

export default FAQ;

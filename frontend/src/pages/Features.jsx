import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useEffect, useRef, useState } from 'react';

const Features = () => {
  const [visibleSections, setVisibleSections] = useState([]);
  const sectionRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => [...prev, entry.target.dataset.section]);
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    { icon: '📅', title: 'Event Management', desc: 'Create and manage university events with role-based participation' },
    { icon: '📝', title: 'Blog System', desc: 'Share knowledge through blogs with approval workflow' },
    { icon: '🎮', title: 'Gamification', desc: 'Earn points, badges, and climb leaderboards' },
    { icon: '🔔', title: 'Real-time Notifications', desc: 'Stay updated with WebSocket notifications' },
    { icon: '🔒', title: 'Role-based Access', desc: 'Student, Faculty, and Admin roles with permissions' },
    { icon: '📊', title: 'Analytics Dashboard', desc: 'Track engagement and system statistics' }
  ];

  return (
    <>
      <style>
        {`
          @keyframes gradientMove {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0) translateX(0); }
            25% { transform: translateY(-20px) translateX(10px); }
            50% { transform: translateY(-10px) translateX(-10px); }
            75% { transform: translateY(-30px) translateX(5px); }
          }
          .animated-bg {
            background: linear-gradient(-45deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1), rgba(6, 182, 212, 0.1));
            background-size: 400% 400%;
            animation: gradientMove 15s ease infinite;
            min-height: 100vh;
            position: relative;
            overflow: hidden;
          }
          .spirit {
            position: absolute;
            border-radius: 50%;
            filter: blur(40px);
            opacity: 0.6;
            animation: float 20s ease-in-out infinite;
          }
          .spirit:nth-child(1) { width: 200px; height: 200px; background: radial-gradient(circle, rgba(99, 102, 241, 0.4), transparent); top: 10%; left: 10%; animation-duration: 18s; }
          .spirit:nth-child(2) { width: 150px; height: 150px; background: radial-gradient(circle, rgba(236, 72, 153, 0.4), transparent); top: 60%; right: 15%; animation-duration: 22s; animation-delay: -5s; }
          .spirit:nth-child(3) { width: 180px; height: 180px; background: radial-gradient(circle, rgba(139, 92, 246, 0.4), transparent); bottom: 20%; left: 20%; animation-duration: 25s; animation-delay: -10s; }
          .spirit:nth-child(4) { width: 120px; height: 120px; background: radial-gradient(circle, rgba(6, 182, 212, 0.4), transparent); top: 30%; right: 30%; animation-duration: 20s; animation-delay: -15s; }
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
          .fade-in-up { opacity: 0; transform: translateY(30px); transition: all 0.8s ease; }
          .fade-in-up.visible { opacity: 1; transform: translateY(0); }
          .feature-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
          .feature-card:hover { transform: translateY(-10px); box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
        `}
      </style>
      <div className="animated-bg">
        <div className="spirit"></div>
        <div className="spirit"></div>
        <div className="spirit"></div>
        <div className="spirit"></div>
        <Container className="py-5" style={{ position: 'relative', zIndex: 1 }}>
        <div className={`text-center mb-5 fade-in-up ${visibleSections.includes('header') ? 'visible' : ''}`}
          ref={(el) => (sectionRefs.current[0] = el)} data-section="header">
          <h1 className="mb-3">✨ Features</h1>
          <p className="lead text-muted">Discover what makes UniHub powerful</p>
        </div>

        <Row>
          {features.map((feature, index) => (
            <Col key={index} md={6} lg={4} className="mb-4">
              <Card className={`h-100 feature-card fade-in-up ${visibleSections.includes(`feature-${index}`) ? 'visible' : ''}`}
                ref={(el) => (sectionRefs.current[index + 1] = el)} data-section={`feature-${index}`}>
                <Card.Body className="text-center p-4">
                  <div style={{ fontSize: '3rem' }}>{feature.icon}</div>
                  <h4 className="mt-3">{feature.title}</h4>
                  <p className="text-muted">{feature.desc}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        </Container>
      </div>
    </>
  );
};

export default Features;

import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useEffect, useRef, useState } from 'react';

const About = () => {
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

  const developers = [
    {
      name: 'Ahmed Rawashdeh',
      bio: 'SDE at Amazon',
      linkedin: 'https://www.linkedin.com/in/ahmed-rawashdeh-893295292',
      github: 'https://github.com/ahmedyraw/',
      image: '/images/team/Ahmed.jpg'
    },
    {
      name: 'Hussam Nafi',
      bio: 'FullStack Engineer at Estarta',
      linkedin: 'https://www.linkedin.com/in/hussam-nafi-6b8498379/',
      github: 'https://github.com/Hussam-Nafi',
      image: '/images/team/Hussam.jpg'
    },
    {
      name: 'Khaleel Ayash',
      bio: 'Backend Engineer at Orange',
      linkedin: 'https://www.linkedin.com/in/khaleel-ayash/',
      github: 'https://github.com/khaleeldawood',
      image: '/images/team/Khaleel.jpg'
    },
    {
      name: 'Mohammad Abu Hammad',
      bio: 'Backend Engineer',
      linkedin: 'https://www.linkedin.com/in/mohammad-abu-hammad04/',
      github: 'https://github.com/MohammadAbdalhaleem',
      image: '/images/team/Mohammad.jpg'
    }
  ];

  return (
    <>
      <style>
        {`
          .fade-in-up {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
          }
          
          .fade-in-up.visible {
            opacity: 1;
            transform: translateY(0);
          }
          
          .team-card {
            position: relative;
            transition: transform 0.3s ease;
          }
          
          .team-card:hover {
            transform: translateY(-10px);
          }
          
          .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: var(--primary-color);
            border-radius: 50%;
            pointer-events: none;
            animation: particleFloat 1s ease-out forwards;
          }
          
          @keyframes particleFloat {
            0% {
              opacity: 1;
              transform: translate(0, 0) scale(1);
            }
            100% {
              opacity: 0;
              transform: translate(var(--tx), var(--ty)) scale(0);
            }
          }
        `}
      </style>
      <Container className="py-5">
      <div 
        className={`text-center mb-5 fade-in-up ${visibleSections.includes('header') ? 'visible' : ''}`}
        ref={(el) => (sectionRefs.current[0] = el)}
        data-section="header"
      >
        <h1 className="text-gradient mb-3">About UniHub</h1>
        <p className="lead" style={{ color: 'var(--text-secondary)' }}>
          A comprehensive university portal platform connecting students, faculty, and administrators
        </p>
      </div>

      <Row className="justify-content-center mb-5">
        <Col md={8}>
          <Card 
            className={`mb-4 fade-in-up ${visibleSections.includes('mission') ? 'visible' : ''}`}
            ref={(el) => (sectionRefs.current[1] = el)}
            data-section="mission"
          >
            <Card.Body className="p-4">
              <h3 className="mb-3">Our Mission</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                UniHub is designed to create a centralized platform for university communities to connect, 
                collaborate, and engage through events, blogs, and gamification features. We aim to enhance 
                the university experience by making it easier for students and faculty to participate in 
                campus activities and share knowledge.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div 
        className={`text-center mb-4 fade-in-up ${visibleSections.includes('team-header') ? 'visible' : ''}`}
        ref={(el) => (sectionRefs.current[2] = el)}
        data-section="team-header"
      >
        <h2 className="mb-4">Meet Our Team</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Developed by a dedicated team of four developers
        </p>
      </div>

      <Row className="justify-content-center">
        {developers.map((dev, index) => (
          <Col key={index} md={6} lg={3} className="mb-4">
            <Card 
              className={`h-100 text-center team-card fade-in-up ${visibleSections.includes(`team-${index}`) ? 'visible' : ''}`}
              ref={(el) => (sectionRefs.current[3 + index] = el)}
              data-section={`team-${index}`}
              onMouseMove={(e) => {
                const card = e.currentTarget;
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                for (let i = 0; i < 3; i++) {
                  const particle = document.createElement('div');
                  particle.className = 'particle';
                  particle.style.left = x + 'px';
                  particle.style.top = y + 'px';
                  particle.style.setProperty('--tx', `${(Math.random() - 0.5) * 100}px`);
                  particle.style.setProperty('--ty', `${(Math.random() - 0.5) * 100}px`);
                  card.appendChild(particle);
                  
                  setTimeout(() => particle.remove(), 1000);
                }
              }}
            >
              <Card.Body className="d-flex flex-column align-items-center justify-content-center p-4">
                <img
                  src={dev.image}
                  alt={dev.name}
                  className="mb-3"
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid var(--primary-color)'
                  }}
                />
                <h5 className="mb-2">{dev.name}</h5>
                <p className="text-muted small mb-3">{dev.bio}</p>
                <div className="d-flex flex-column gap-2">
                  <a
                    href={dev.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary btn-sm"
                  >
                    <i className="bi bi-linkedin"></i> LinkedIn
                  </a>
                  <a
                    href={dev.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-dark btn-sm"
                  >
                    <i className="bi bi-github"></i> GitHub
                  </a>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="justify-content-center mt-5">
        <Col md={8}>
          <Card 
            className={`fade-in-up ${visibleSections.includes('tech') ? 'visible' : ''}`}
            ref={(el) => (sectionRefs.current[7] = el)}
            data-section="tech"
          >
            <Card.Body className="p-4 text-center">
              <h4 className="mb-3">Technologies Used</h4>
              <div className="d-flex flex-wrap justify-content-center gap-2">
                <span className="badge bg-primary">Spring Boot</span>
                <span className="badge bg-primary">React</span>
                <span className="badge bg-primary">PostgreSQL</span>
                <span className="badge bg-primary">JWT</span>
                <span className="badge bg-primary">WebSocket</span>
                <span className="badge bg-primary">Bootstrap</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
        </Container>
    </>
  );
};

export default About;

import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import reportService from '../services/reportService';
import { getTimeAgo } from '../utils/helpers';

const Reports = () => {
  const [eventReports, setEventReports] = useState([]);
  const [blogReports, setBlogReports] = useState([]);
  const [filter, setFilter] = useState('ALL'); // ALL, EVENT, BLOG
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadReports();
  }, [statusFilter]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const [events, blogs] = await Promise.all([
        reportService.getEventReports({ status: statusFilter === 'ALL' ? undefined : statusFilter }),
        reportService.getBlogReports({ status: statusFilter === 'ALL' ? undefined : statusFilter })
      ]);
      setEventReports(Array.isArray(events) ? events : []);
      setBlogReports(Array.isArray(blogs) ? blogs : []);
    } catch (err) {
      console.error('Failed to load reports:', err);
      setError('Failed to load reports');
      setEventReports([]);
      setBlogReports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveReport = async (reportId, type) => {
    try {
      if (type === 'event') {
        await reportService.resolveEventReport(reportId);
      } else {
        await reportService.resolveBlogReport(reportId);
      }
      setSuccess('Report resolved successfully');
      loadReports();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resolve report');
    }
  };

  const handleDismissReport = async (reportId, type) => {
    try {
      if (type === 'event') {
        await reportService.dismissEventReport(reportId);
      } else {
        await reportService.dismissBlogReport(reportId);
      }
      setSuccess('Report dismissed successfully');
      loadReports();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to dismiss report');
    }
  };

  const filteredEventReports = filter === 'BLOG' ? [] : eventReports;
  const filteredBlogReports = filter === 'EVENT' ? [] : blogReports;

  const resolveReportDate = (report) =>
    report?.createdAt || report?.created_at || report?.reportedAt || report?.reported_at;

  const resolveReporterName = (report) =>
    report?.reportedBy?.name ||
    report?.reportedByName ||
    report?.reported_by?.name ||
    report?.reportedBy?.email ||
    'Unknown';

  return (
    <Container className="py-4">
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      <Row className="mb-4">
        <Col>
          <h2>Content Reports</h2>
          <p className="text-muted">Manage reported events and blogs</p>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <Form.Label style={{ fontWeight: '600' }}>Report Type</Form.Label>
              <Form.Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="ALL">All Reports</option>
                <option value="EVENT">Event Reports</option>
                <option value="BLOG">Blog Reports</option>
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Label style={{ fontWeight: '600' }}>Status</Form.Label>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="REVIEWED">Resolved</option>
                <option value="DISMISSED">Dismissed</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
        </div>
      ) : (
        <>
          {/* Event Reports */}
          {filteredEventReports.length > 0 && (
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Event Reports ({filteredEventReports.length})</h5>
              </Card.Header>
              <Card.Body>
                <Table responsive hover className="mb-0 text-center">
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Reported By</th>
                      <th>Reason</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEventReports.map((report) => {
                      const eventId = report.event?.eventId ?? report.eventId;
                      const eventTitle = report.event?.title ?? report.eventTitle ?? 'Event';
                      const eventCreatorName = report.event?.creator?.name ?? report.eventCreatorName ?? 'Unknown';
                      const reportedByName = resolveReporterName(report);
                      const createdAt = resolveReportDate(report);

                      return (
                      <tr key={report.reportId}>
                        <td>
                          {eventId ? (
                            <Link to={`/events/${eventId}`}>
                              {eventTitle}
                            </Link>
                          ) : (
                            <span>{eventTitle}</span>
                          )}
                          <div className="text-muted small">by {eventCreatorName}</div>
                        </td>
                        <td>{reportedByName}</td>
                        <td>
                          <div style={{ maxWidth: '300px' }}>
                            {report.reason}
                          </div>
                        </td>
                        <td>
                          <small>{createdAt ? getTimeAgo(createdAt) : 'N/A'}</small>
                        </td>
                        <td>
                          <Badge bg={
                            report.status === 'PENDING' ? 'warning' :
                            report.status === 'REVIEWED' ? 'success' : 'secondary'
                          }>
                            {report.status === 'REVIEWED' ? 'RESOLVED' : report.status}
                          </Badge>
                        </td>
                        <td>
                          {report.status === 'PENDING' && (
                            <div className="d-flex gap-2">
                              <Button
                                size="sm"
                                variant="success"
                                onClick={() => handleResolveReport(report.reportId, 'event')}
                              >
                                Resolve
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleDismissReport(report.reportId, 'event')}
                              >
                                Dismiss
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}

          {/* Blog Reports */}
          {filteredBlogReports.length > 0 && (
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Blog Reports ({filteredBlogReports.length})</h5>
              </Card.Header>
              <Card.Body>
                <Table responsive hover className="mb-0 text-center">
                  <thead>
                    <tr>
                      <th>Blog</th>
                      <th>Reported By</th>
                      <th>Reason</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBlogReports.map((report) => {
                      const blogId = report.blog?.blogId ?? report.blogId;
                      const blogTitle = report.blog?.title ?? report.blogTitle ?? 'Blog';
                      const blogAuthorName = report.blog?.author?.name ?? report.blogAuthorName ?? 'Unknown';
                      const reportedByName = resolveReporterName(report);
                      const createdAt = resolveReportDate(report);

                      return (
                      <tr key={report.reportId}>
                        <td>
                          {blogId ? (
                            <Link to={`/blogs/${blogId}`}>
                              {blogTitle}
                            </Link>
                          ) : (
                            <span>{blogTitle}</span>
                          )}
                          <div className="text-muted small">by {blogAuthorName}</div>
                        </td>
                        <td>{reportedByName}</td>
                        <td>
                          <div style={{ maxWidth: '300px' }}>
                            {report.reason}
                          </div>
                        </td>
                        <td>
                          <small>{createdAt ? getTimeAgo(createdAt) : 'N/A'}</small>
                        </td>
                        <td>
                          <Badge bg={
                            report.status === 'PENDING' ? 'warning' :
                            report.status === 'REVIEWED' ? 'success' : 'secondary'
                          }>
                            {report.status === 'REVIEWED' ? 'RESOLVED' : report.status}
                          </Badge>
                        </td>
                        <td>
                          {report.status === 'PENDING' && (
                            <div className="d-flex gap-2">
                              <Button
                                size="sm"
                                variant="success"
                                onClick={() => handleResolveReport(report.reportId, 'blog')}
                              >
                                Resolve
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleDismissReport(report.reportId, 'blog')}
                              >
                                Dismiss
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}

          {filteredEventReports.length === 0 && filteredBlogReports.length === 0 && (
            <Card>
              <Card.Body className="text-center py-5">
                <p className="text-muted mb-0">No reports found</p>
              </Card.Body>
            </Card>
          )}
        </>
      )}
    </Container>
  );
};

export default Reports;

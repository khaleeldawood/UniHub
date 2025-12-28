import React, { useState, useEffect } from 'react';
import { Container, Card, ListGroup, Badge, Button } from 'react-bootstrap';
import notificationService from '../services/notificationService';
import { getTimeAgo, getNotificationIcon } from '../utils/helpers';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      // Show all notifications (read and unread) in navbar/notifications page
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      // Update notification to show as read (don't remove it)
      setNotifications(notifications.map(n => 
        n.notificationId === id ? { ...n, isRead: true } : n
      ));
      
      // Trigger update for navbar badge count
      window.dispatchEvent(new CustomEvent('notificationRead'));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      // Mark all as read (don't remove them)
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      
      // Trigger update for navbar badge count
      window.dispatchEvent(new CustomEvent('notificationRead'));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🔔 Notifications</h2>
        {notifications.some(n => !n.isRead) && (
          <Button variant="outline-primary" size="sm" onClick={markAllAsRead}>
            Mark All as Read
          </Button>
        )}
      </div>

      <Card>
        <ListGroup variant="flush">
          {loading ? (
            <ListGroup.Item className="text-center py-5">
              <div className="spinner-border text-primary" />
            </ListGroup.Item>
          ) : notifications.length > 0 ? (
            notifications.map(notif => (
              <ListGroup.Item 
                key={notif.notificationId}
                className={!notif.isRead ? 'bg-light' : ''}
              >
                <div className="d-flex align-items-start">
                  <div className="me-3 fs-4">{getNotificationIcon(notif.type)}</div>
                  <div className="flex-grow-1">
                    <div className={!notif.isRead ? 'fw-bold' : ''}>{notif.message}</div>
                    <div className="text-muted small">{getTimeAgo(notif.createdAt)}</div>
                  </div>
                  {!notif.isRead && (
                    <Button 
                      size="sm" 
                      variant="link" 
                      onClick={() => markAsRead(notif.notificationId)}
                    >
                      Mark as read
                    </Button>
                  )}
                </div>
              </ListGroup.Item>
            ))
          ) : (
            <ListGroup.Item className="text-center text-muted py-5">
              No notifications
            </ListGroup.Item>
          )}
        </ListGroup>
      </Card>
    </Container>
  );
};

export default Notifications;

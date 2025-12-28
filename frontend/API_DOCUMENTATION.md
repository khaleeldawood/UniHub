# UniHub Frontend - API Documentation

Complete guide for using all API services in the frontend application.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Authentication APIs](#authentication-apis)
3. [Event APIs](#event-apis)
4. [Blog APIs](#blog-apis)
5. [Gamification APIs](#gamification-apis)
6. [Notification APIs](#notification-apis)
7. [User APIs](#user-apis)
8. [Admin APIs](#admin-apis)
9. [Report APIs](#report-apis)
10. [Error Handling](#error-handling)

---

## Overview

All API services are located in `src/services/` and use the base Axios instance from `api.js`.

### Base Configuration

```javascript
// API Base URL
const API_BASE_URL = 'http://localhost:8080/api';

// All requests automatically include JWT token from localStorage
// Handled by Axios interceptor in api.js
```

### Import Services

```javascript
import authService from '../services/authService';
import eventService from '../services/eventService';
import blogService from '../services/blogService';
import gamificationService from '../services/gamificationService';
import notificationService from '../services/notificationService';
import userService from '../services/userService';
import adminService from '../services/adminService';
import reportService from '../services/reportService';
```

---

## Authentication APIs

### authService

#### `register(data)`

Register a new user.

**Parameters:**
```javascript
{
  name: string,          // Min 2 characters
  email: string,         // Valid email
  password: string,      // Min 6 characters
  role: string,          // "STUDENT", "SUPERVISOR", or "ADMIN"
  universityId: number   // University ID (optional for admin)
}
```

**Example:**
```javascript
import authService from '../services/authService';
import { USER_ROLES } from '../utils/constants';

const handleRegister = async () => {
  try {
    const response = await authService.register({
      name: "John Doe",
      email: "john@university.edu",
      password: "password123",
      role: USER_ROLES.STUDENT,
      universityId: 1
    });
    
    // Response includes: token, userId, name, email, role, points, etc.
    console.log('Registered:', response);
    // Token and user automatically stored in localStorage
    // Navigate to dashboard
  } catch (error) {
    console.error('Registration failed:', error.response?.data);
  }
};
```

**Response:**
```javascript
{
  token: "eyJhbGciOiJIUzI1NiJ9...",
  userId: 1,
  name: "John Doe",
  email: "john@university.edu",
  role: "STUDENT",
  points: 0,
  universityId: 1,
  universityName: "Example University",
  currentBadgeName: "Newcomer"
}
```

---

#### `login(email, password)`

Authenticate user.

**Example:**
```javascript
const handleLogin = async () => {
  try {
    const response = await authService.login(
      "john@university.edu",
      "password123"
    );
    
    console.log('Logged in:', response);
    // Same response format as register
    // Token stored automatically
  } catch (error) {
    console.error('Login failed:', error.response?.data);
  }
};
```

---

#### `logout()`

Clear session and redirect to login.

**Example:**
```javascript
const handleLogout = () => {
  authService.logout();
  // Clears localStorage
  // Redirects to /login
};
```

---

#### `getCurrentUser()`

Get user from localStorage (synchronous).

**Example:**
```javascript
const user = authService.getCurrentUser();
if (user) {
  console.log('Current user:', user.name, user.points);
}
```

---

#### `isAuthenticated()`

Check if user is logged in (synchronous).

**Example:**
```javascript
if (authService.isAuthenticated()) {
  // User is logged in
} else {
  // Redirect to login
}
```

---

#### `hasRole(role)`

Check if user has specific role (synchronous).

**Example:**
```javascript
import { USER_ROLES } from '../utils/constants';

if (authService.hasRole(USER_ROLES.ADMIN)) {
  // User is admin
}
```

---

## Event APIs

### eventService

#### `getAllEvents(filters)`

Get list of events with optional filters.

**Parameters:**
```javascript
{
  universityId?: number,  // Filter by university
  status?: string,        // "PENDING", "APPROVED", "CANCELLED"
  type?: string          // "Workshop", "Seminar", etc.
}
```

**Example:**
```javascript
import eventService from '../services/eventService';
import { EVENT_STATUS } from '../utils/constants';

const loadEvents = async () => {
  try {
    // Get all approved events
    const events = await eventService.getAllEvents({
      status: EVENT_STATUS.APPROVED
    });
    
    console.log('Events:', events);
  } catch (error) {
    console.error('Failed to load events:', error);
  }
};
```

**Response:**
```javascript
[
  {
    eventId: 1,
    title: "React Workshop",
    description: "Learn React basics",
    location: "Lab 101",
    startDate: "2025-02-01T14:00:00",
    endDate: "2025-02-01T16:00:00",
    type: "Workshop",
    status: "APPROVED",
    creator: {
      userId: 1,
      name: "John Doe"
    },
    university: {
      universityId: 1,
      name: "Example University"
    },
    participants: [...]
  }
]
```

---

#### `getEventById(id)`

Get single event details.

**Example:**
```javascript
const loadEventDetails = async (eventId) => {
  try {
    const event = await eventService.getEventById(eventId);
    console.log('Event:', event);
  } catch (error) {
    console.error('Event not found:', error);
  }
};
```

---

#### `createEvent(eventData)`

Create new event proposal.

**Parameters:**
```javascript
{
  title: string,         // Min 3 characters
  description: string,   // Required
  location: string,      // Required
  startDate: string,     // ISO format: "2025-02-01T14:00:00"
  endDate: string,       // ISO format
  type: string          // "Workshop", "Seminar", etc.
}
```

**Example:**
```javascript
const handleCreateEvent = async () => {
  try {
    const event = await eventService.createEvent({
      title: "Spring Boot Workshop",
      description: "Introduction to Spring Boot",
      location: "Computer Lab 301",
      startDate: "2025-02-01T14:00:00",
      endDate: "2025-02-01T17:00:00",
      type: "Workshop"
    });
    
    console.log('Event created:', event);
    // Event status will be "PENDING"
    // Navigate to /my-events
  } catch (error) {
    console.error('Failed to create event:', error.response?.data);
  }
};
```

---

#### `joinEvent(eventId, role)`

Join an event as participant.

**Parameters:**
```javascript
eventId: number
role: "ORGANIZER" | "VOLUNTEER" | "ATTENDEE"
```

**Points Earned:**
- ORGANIZER: 50 points
- VOLUNTEER: 20 points
- ATTENDEE: 10 points

**Example:**
```javascript
import { PARTICIPANT_ROLES, PARTICIPANT_POINTS } from '../utils/constants';

const handleJoinEvent = async (eventId) => {
  try {
    await eventService.joinEvent(eventId, PARTICIPANT_ROLES.VOLUNTEER);
    
    // Success! User earned 20 points
    // Backend:
    // - Creates EventParticipant record
    // - Awards points via GamificationService
    // - Checks badge threshold
    // - Sends WebSocket if badge earned
    // - Sends leaderboard update WebSocket
    
    console.log(`Joined event! Earned ${PARTICIPANT_POINTS.VOLUNTEER} points`);
  } catch (error) {
    if (error.response?.status === 409) {
      console.error('Already joined this event');
    } else {
      console.error('Failed to join:', error.response?.data);
    }
  }
};
```

---

#### `approveEvent(eventId)`

Approve an event (Supervisor/Admin only).

**Example:**
```javascript
const handleApproveEvent = async (eventId) => {
  try {
    await eventService.approveEvent(eventId);
    
    // Success!
    // - Event status changed to "APPROVED"
    // - Notification sent to event creator
    // - Dashboard WebSocket sent to creator
    
    console.log('Event approved!');
    // Reload event list
  } catch (error) {
    if (error.response?.status === 403) {
      console.error('You do not have permission to approve events');
    }
  }
};
```

---

#### `rejectEvent(eventId, reason)`

Reject an event.

**Example:**
```javascript
const handleRejectEvent = async (eventId) => {
  const reason = "Insufficient details provided";
  
  try {
    await eventService.rejectEvent(eventId, reason);
    console.log('Event rejected');
  } catch (error) {
    console.error('Failed to reject:', error);
  }
};
```

---

#### `getMyEvents()`

Get events created by current user.

**Example:**
```javascript
const loadMyEvents = async () => {
  try {
    const events = await eventService.getMyEvents();
    console.log('My events:', events);
  } catch (error) {
    console.error('Failed to load:', error);
  }
};
```

---

#### `getMyParticipations()`

Get events user is participating in.

**Example:**
```javascript
const loadParticipations = async () => {
  try {
    const participations = await eventService.getMyParticipations();
    // Returns EventParticipant objects with event and role
    console.log('My participations:', participations);
  } catch (error) {
    console.error('Failed to load:', error);
  }
};
```

---

#### `getEventParticipants(eventId)`

Get list of participants for an event.

**Example:**
```javascript
const loadParticipants = async (eventId) => {
  try {
    const participants = await eventService.getEventParticipants(eventId);
    // Returns array of EventParticipant with user and role
    participants.forEach(p => {
      console.log(`${p.user.name} - ${p.role} (${p.pointsAwarded} pts)`);
    });
  } catch (error) {
    console.error('Failed to load participants:', error);
  }
};
```

---

## Blog APIs

### blogService

#### `getAllBlogs(filters)`

Get list of blogs with optional filters.

**Parameters:**
```javascript
{
  universityId?: number,  // Filter by university
  category?: string,      // "ARTICLE", "INTERNSHIP", "JOB"
  status?: string,        // "PENDING", "APPROVED", "REJECTED"
  isGlobal?: boolean     // true for global blogs only
}
```

**Example:**
```javascript
import blogService from '../services/blogService';
import { BLOG_STATUS, BLOG_CATEGORIES } from '../utils/constants';

const loadBlogs = async () => {
  try {
    const blogs = await blogService.getAllBlogs({
      status: BLOG_STATUS.APPROVED,
      category: BLOG_CATEGORIES.INTERNSHIP
    });
    
    console.log('Internship opportunities:', blogs);
  } catch (error) {
    console.error('Failed to load blogs:', error);
  }
};
```

---

#### `createBlog(blogData)`

Create new blog post.

**Parameters:**
```javascript
{
  title: string,        // Min 3 characters
  content: string,      // Required
  category: string,     // "ARTICLE", "INTERNSHIP", "JOB"
  isGlobal: boolean    // Default false
}
```

**Example:**
```javascript
const handleCreateBlog = async () => {
  try {
    const blog = await blogService.createBlog({
      title: "Software Engineering Internship at TechCorp",
      content: "We're looking for talented students...",
      category: BLOG_CATEGORIES.INTERNSHIP,
      isGlobal: true  // Visible across all universities
    });
    
    console.log('Blog created:', blog);
    // Blog status will be "PENDING"
  } catch (error) {
    console.error('Failed to create blog:', error.response?.data);
  }
};
```

---

#### `approveBlog(blogId)`

Approve a blog (Supervisor only).

**Points Awarded:**
- Student author: 30 points
- Supervisor author: 50 points

**Example:**
```javascript
const handleApproveBlog = async (blogId) => {
  try {
    await blogService.approveBlog(blogId);
    
    // Success!
    // - Blog status changed to "APPROVED"
    // - Author earns points (30 or 50 based on role)
    // - Badge check performed
    // - Notification sent to author
    // - WebSocket badge promotion if threshold crossed
    
    console.log('Blog approved! Author earned points');
  } catch (error) {
    console.error('Failed to approve:', error);
  }
};
```

---

## Gamification APIs

### gamificationService

#### `getLeaderboard(scope, type, universityId)`

Get leaderboard rankings.

**Parameters:**
```javascript
scope: "UNIVERSITY" | "GLOBAL"
type: "MEMBERS" | "EVENTS"
universityId: number | null  // Required if scope is "UNIVERSITY"
```

**Example:**
```javascript
import { LEADERBOARD_SCOPES, LEADERBOARD_TYPES } from '../utils/constants';

// Get global members leaderboard
const loadGlobalLeaderboard = async () => {
  try {
    const data = await gamificationService.getLeaderboard(
      LEADERBOARD_SCOPES.GLOBAL,
      LEADERBOARD_TYPES.MEMBERS,
      null
    );
    
    console.log('Top members:', data.rankings);
  } catch (error) {
    console.error('Failed to load leaderboard:', error);
  }
};

// Get university events leaderboard
const loadUniversityEvents = async (universityId) => {
  try {
    const data = await gamificationService.getLeaderboard(
      LEADERBOARD_SCOPES.UNIVERSITY,
      LEADERBOARD_TYPES.EVENTS,
      universityId
    );
    
    console.log('Top university events:', data.rankings);
  } catch (error) {
    console.error('Failed to load:', error);
  }
};
```

**Response (Members):**
```javascript
{
  scope: "GLOBAL",
  type: "MEMBERS",
  rankings: [
    {
      userId: 5,
      name: "Alice Johnson",
      university: {
        universityId: 1,
        name: "Tech University"
      },
      points: 850,
      currentBadge: {
        badgeId: 4,
        name: "Leader",
        pointsThreshold: 600
      }
    }
  ]
}
```

---

#### `getAllBadges()`

Get all badge definitions.

**Example:**
```javascript
const loadBadges = async () => {
  try {
    const badges = await gamificationService.getAllBadges();
    
    badges.forEach(badge => {
      console.log(`${badge.name}: ${badge.pointsThreshold} points`);
    });
  } catch (error) {
    console.error('Failed to load badges:', error);
  }
};
```

**Response:**
```javascript
[
  {
    badgeId: 1,
    name: "Newcomer",
    description: "Welcome to UniHub!",
    pointsThreshold: 0
  },
  {
    badgeId: 2,
    name: "Explorer",
    description: "Earned 100 points",
    pointsThreshold: 100
  },
  // ... more badges
]
```

---

#### `getMyBadges()`

Get user's badge progress (requires authentication).

**Example:**
```javascript
const loadMyBadges = async () => {
  try {
    const data = await gamificationService.getMyBadges();
    
    console.log('All badges:', data.allBadges);
    console.log('Badges I earned:', data.earnedBadges);
    console.log('My current points:', data.currentPoints);
    console.log('My current badge:', data.currentBadge);
  } catch (error) {
    console.error('Failed to load:', error);
  }
};
```

**Response:**
```javascript
{
  allBadges: [ /* Array of all 6 badges */ ],
  earnedBadges: [
    {
      userBadgeId: 1,
      user: { userId: 1, name: "John" },
      badge: { badgeId: 1, name: "Newcomer" },
      earnedAt: "2025-01-01T10:00:00"
    },
    {
      userBadgeId: 2,
      badge: { badgeId: 2, name: "Explorer" },
      earnedAt: "2025-01-15T14:30:00"
    }
  ],
  currentPoints: 150,
  currentBadge: {
    badgeId: 2,
    name: "Explorer",
    pointsThreshold: 100
  }
}
```

---

## Notification APIs

### notificationService

#### `getNotifications(filters)`

Get user's notifications.

**Parameters:**
```javascript
{
  isRead?: boolean,        // true/false
  type?: string           // "BADGE_EARNED", "EVENT_UPDATE", etc.
}
```

**Example:**
```javascript
import notificationService from '../services/notificationService';

// Get all unread notifications
const loadUnreadNotifications = async () => {
  try {
    const notifications = await notificationService.getNotifications({
      isRead: false
    });
    
    console.log('Unread:', notifications);
  } catch (error) {
    console.error('Failed to load:', error);
  }
};

// Get badge earned notifications
const loadBadgeNotifications = async () => {
  try {
    const notifications = await notificationService.getNotifications({
      type: 'BADGE_EARNED'
    });
    
    console.log('Badge notifications:', notifications);
  } catch (error) {
    console.error('Failed to load:', error);
  }
};
```

**Response:**
```javascript
[
  {
    notificationId: 1,
    message: "Congratulations! You've earned the Explorer badge!",
    type: "BADGE_EARNED",
    isRead: false,
    linkUrl: "/badges",
    createdAt: "2025-01-15T14:30:00"
  }
]
```

---

#### `getUnreadCount()`

Get count of unread notifications.

**Example:**
```javascript
const loadUnreadCount = async () => {
  try {
    const count = await notificationService.getUnreadCount();
    console.log('Unread count:', count);
    // Display in navbar badge
  } catch (error) {
    console.error('Failed to load count:', error);
  }
};
```

**Response:** `number` (e.g., `5`)

---

#### `markAsRead(notificationId)`

Mark single notification as read.

**Example:**
```javascript
const markNotificationRead = async (notificationId) => {
  try {
    await notificationService.markAsRead(notificationId);
    console.log('Marked as read');
    // Reload notifications
  } catch (error) {
    console.error('Failed to mark as read:', error);
  }
};
```

---

#### `markAllAsRead()`

Mark all notifications as read.

**Example:**
```javascript
const markAllRead = async () => {
  try {
    await notificationService.markAllAsRead();
    console.log('All marked as read');
    // Reload notifications
  } catch (error) {
    console.error('Failed:', error);
  }
};
```

---

## User APIs

### userService

#### `getCurrentUser()`

Get current user's full profile.

**Example:**
```javascript
import userService from '../services/userService';

const loadUserProfile = async () => {
  try {
    const user = await userService.getCurrentUser();
    console.log('User profile:', user);
    // Returns complete User object from backend
  } catch (error) {
    console.error('Failed to load profile:', error);
  }
};
```

---

#### `changePassword(oldPassword, newPassword)`

Change user's password.

**Example:**
```javascript
const handleChangePassword = async () => {
  try {
    await userService.changePassword(
      "oldPassword123",
      "newPassword456"
    );
    
    console.log('Password changed successfully');
  } catch (error) {
    if (error.response?.status === 400) {
      console.error('Current password is incorrect');
    } else {
      console.error('Failed to change password:', error);
    }
  }
};
```

---

## Admin APIs

### adminService

#### `getAnalytics()`

Get system-wide analytics (Admin only).

**Example:**
```javascript
import adminService from '../services/adminService';

const loadAnalytics = async () => {
  try {
    const analytics = await adminService.getAnalytics();
    
    console.log('Total users:', analytics.totalUsers);
    console.log('Total events:', analytics.totalEvents);
    console.log('Pending approvals:', analytics.pendingApprovals);
    console.log('Users by role:', analytics.usersByRole);
  } catch (error) {
    if (error.response?.status === 403) {
      console.error('Admin access required');
    }
  }
};
```

**Response:**
```javascript
{
  totalUsers: 1250,
  totalEvents: 89,
  totalBlogs: 234,
  totalUniversities: 5,
  activeUsers: 450,
  pendingApprovals: {
    events: 12,
    blogs: 8
  },
  usersByRole: {
    students: 1100,
    supervisors: 140,
    admins: 10
  }
}
```

---

## Error Handling

### Common HTTP Status Codes

| Code | Meaning | Frontend Action |
|------|---------|----------------|
| 200 | Success | Display success message |
| 201 | Created | Show created item |
| 400 | Bad Request | Show validation errors |
| 401 | Unauthorized | Auto-logout, redirect to login |
| 403 | Forbidden | Show "Access Denied" |
| 404 | Not Found | Show "Not found" message |
| 409 | Conflict | Show conflict message (e.g., "Already joined") |
| 500 | Server Error | Show generic error |

### Error Handling Pattern

```javascript
const handleApiCall = async () => {
  try {
    const result = await someService.someMethod();
    // Success handling
    setSuccess('Operation successful!');
  } catch (error) {
    // Error handling
    if (error.response) {
      // Server responded with error
      const status = error.response.status;
      const message = error.response.data?.message;
      
      switch (status) {
        case 400:
          setError(`Validation error: ${message}`);
          break;
        case 401:
          // Handled globally by interceptor
          break;
        case 403:
          setError('You do not have permission');
          break;
        case 404:
          setError('Resource not found');
          break;
        case 409:
          setError(`Conflict: ${message}`);
          break;
        default:
          setError(message || 'An error occurred');
      }
    } else if (error.request) {
      // Request made but no response
      setError('Cannot connect to server. Is the backend running?');
    } else {
      // Other error
      setError('An unexpected error occurred');
    }
  }
};
```

---

## WebSocket Integration

### Connecting to WebSocket

**Automatic Connection:**
WebSocket connects automatically after login via `AuthContext`:

```javascript
// In AuthContext.jsx
const login = async (email, password) => {
  const userData = await authService.login(email, password);
  setUser(userData);
  
  // Connect WebSocket after successful login
  websocketService.connect(() => {
    console.log('WebSocket connected');
  });
};
```

### Using WebSocket Hook

**In your component:**
```javascript
import { useWebSocket } from '../hooks/useWebSocket';

const MyComponent = () => {
  const { badgeEarned, leaderboardUpdated, dashboardUpdated, clearBadgeNotification } = useWebSocket();
  
  // Show badge modal when badge earned
  useEffect(() => {
    if (badgeEarned) {
      // Badge data available
      console.log('Badge earned:', badgeEarned);
      // BadgeModal component will automatically display
    }
  }, [badgeEarned]);
  
  // Reload leaderboard when updated
  useEffect(() => {
    if (leaderboardUpdated) {
      loadLeaderboard();
    }
  }, [leaderboardUpdated]);
  
  // Reload dashboard when updated
  useEffect(() => {
    if (dashboardUpdated) {
      loadDashboardData();
    }
  }, [dashboardUpdated]);
  
  return (
    <>
      <BadgeModal 
        badge={badgeEarned} 
        show={!!badgeEarned} 
        onHide={clearBadgeNotification} 
      />
      {/* Your component content */}
    </>
  );
};
```

---

## Complete Usage Example

### Full Event Join Flow with Points & Badge

```javascript
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../hooks/useWebSocket';
import eventService from '../services/eventService';
import BadgeModal from '../components/common/BadgeModal';
import { PARTICIPANT_ROLES, PARTICIPANT_POINTS } from '../utils/constants';

const EventJoinExample = ({ eventId }) => {
  const { user, updateUser } = useAuth();
  const { badgeEarned, clearBadgeNotification } = useWebSocket();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleJoinEvent = async (role) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // 1. Join event
      await eventService.joinEvent(eventId, role);
      
      // 2. Calculate points earned
      const pointsEarned = PARTICIPANT_POINTS[role];
      
      // 3. Update local user object
      const updatedUser = {
        ...user,
        points: user.points + pointsEarned
      };
      updateUser(updatedUser);
      
      // 4. Show success message
      setSuccess(`Successfully joined as ${role}! You earned ${pointsEarned} points!`);
      
      // 5. If badge earned, WebSocket will trigger BadgeModal
      // No manual handling needed - useWebSocket hook manages it
      
      // 6. Reload event details to show updated participants
      // loadEventDetails();
      
    } catch (error) {
      if (error.response?.status === 409) {
        setError('You have already joined this event');
      } else if (error.response?.status === 400) {
        setError('Cannot join: Event is not approved');
      } else {
        setError(error.response?.data?.message || 'Failed to join event');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Badge Modal - shows automatically via WebSocket */}
      <BadgeModal
        badge={badgeEarned}
        show={!!badgeEarned}
        onHide={clearBadgeNotification}
      />
      
      {/* Success/Error Messages */}
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      
      {/* Join Buttons */}
      <div className="d-flex gap-2">
        <button 
          className="btn btn-danger"
          onClick={() => handleJoinEvent(PARTICIPANT_ROLES.ORGANIZER)}
          disabled={loading}
        >
          Organizer (50 pts)
        </button>
        <button 
          className="btn btn-success"
          onClick={() => handleJoinEvent(PARTICIPANT_ROLES.VOLUNTEER)}
          disabled={loading}
        >
          Volunteer (20 pts)
        </button>
        <button 
          className="btn btn-info"
          onClick={() => handleJoinEvent(PARTICIPANT_ROLES.ATTENDEE)}
          disabled={loading}
        >
          Attendee (10 pts)
        </button>
      </div>
    </div>
  );
};
```

---

## Quick Reference

### Import All Services

```javascript
import authService from '../services/authService';
import eventService from '../services/eventService';
import blogService from '../services/blogService';
import gamificationService from '../services/gamificationService';
import notificationService from '../services/notificationService';
import userService from '../services/userService';
import adminService from '../services/adminService';
import reportService from '../services/reportService';
import websocketService from '../services/websocketService';
```

### Common Operations

```javascript
// Authentication
await authService.register(data);
await authService.login(email, password);
authService.logout();

// Events
const events = await eventService.getAllEvents({ status: 'APPROVED' });
await eventService.joinEvent(eventId, 'VOLUNTEER');
await eventService.approveEvent(eventId); // Supervisor

// Blogs  
const blogs = await blogService.getAllBlogs({ category: 'INTERNSHIP' });
await blogService.approveBlog(blogId); // Supervisor

// Gamification
const leaderboard = await gamificationService.getLeaderboard('GLOBAL', 'MEMBERS');
const badges = await gamificationService.getMyBadges();

// Notifications
const notifications = await notificationService.getNotifications();
const count = await notificationService.getUnreadCount();
await notificationService.markAsRead(id);
```

---

## Summary

This API documentation covers:
- ✅ All 7 service modules
- ✅ All major API methods
- ✅ Request parameters and types
- ✅ Response formats
- ✅ Code examples
- ✅ Error handling patterns
- ✅ WebSocket integration
- ✅ Complete usage examples

**For backend API endpoints, see:** `../BACKEND

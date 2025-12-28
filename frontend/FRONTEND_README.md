# UniHub Frontend - Comprehensive Documentation

## Table of Contents
1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Core Features](#core-features)
5. [Component Architecture](#component-architecture)
6. [API Integration](#api-integration)
7. [WebSocket Real-Time Updates](#websocket-real-time-updates)
8. [Authentication Flow](#authentication-flow)
9. [Routing & Navigation](#routing--navigation)
10. [State Management](#state-management)

---

## Overview

UniHub frontend is a React-based single-page application (SPA) built with Vite, providing a modern, responsive interface for the university engagement platform. It seamlessly integrates with the Spring Boot backend through REST APIs and WebSocket connections.

### Key Capabilities
- 📱 Responsive Bootstrap-based UI
- 🔐 JWT authentication with role-based access
- 📡 Real-time updates via WebSocket (badge promotions, leaderboard changes)
- 🎯 Complete event and blog management
- 🏆 Gamification with points, badges, and leaderboards
- 🔔 Notification system with unread counts
- 👥 Multi-university support
- ⚡ Fast navigation with React Router
- 🎨 Clean, intuitive user experience

---

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.0 | UI framework |
| **Vite** | 7.2.2 | Build tool and dev server |
| **React Router** | 6.28.0 | Client-side routing |
| **Bootstrap** | 5.3.3 | CSS framework |
| **React Bootstrap** | 2.10.6 | Bootstrap React components |
| **Axios** | 1.7.9 | HTTP client for API calls |
| **SockJS Client** | 1.6.1 | WebSocket fallback |
| **@stomp/stompjs** | 7.0.0 | STOMP over WebSocket |
| **React Hook Form** | 7.54.2 | Form management |
| **Recharts** | 2.15.0 | Charts for analytics |
| **React Icons** | 5.4.0 | Icon library |

---

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── ProtectedRoute.jsx          # Route protection with role checking
│   │   └── common/
│   │       ├── Navbar.jsx                   # Navigation with notifications badge
│   │       ├── Footer.jsx                   # Footer component
│   │       └── BadgeModal.jsx               # WebSocket badge promotion pop-up
│   ├── context/
│   │   └── AuthContext.jsx                  # Authentication state management
│   ├── hooks/
│   │   └── useWebSocket.js                  # Custom WebSocket hook
│   ├── pages/
│   │   ├── Home.jsx                         # Landing page
│   │   ├── Login.jsx                        # Login page
│   │   ├── Register.jsx                     # Registration page
│   │   ├── Dashboard.jsx                    # Main dashboard with WebSocket
│   │   ├── Events.jsx                       # Events list with filters
│   │   ├── EventDetails.jsx                 # Event details with join functionality
│   │   ├── CreateEvent.jsx                  # Create event form
│   │   ├── MyEvents.jsx                     # User's created events
│   │   ├── EventApprovals.jsx               # Supervisor approval queue
│   │   ├── Blogs.jsx                        # Blogs list with filters
│   │   ├── CreateBlog.jsx                   # Create blog form
│   │   ├── MyBlogs.jsx                      # User's blogs
│   │   ├── BlogApprovals.jsx                # Supervisor blog approvals
│   │   ├── Leaderboard.jsx                  # Leaderboard with real-time updates
│   │   ├── Badges.jsx                       # Badge showcase
│   │   ├── Notifications.jsx                # Notifications center
│   │   ├── Settings.jsx                     # User settings
│   │   ├── Profile.jsx                      # User profile
│   │   ├── Reports.jsx                      # Content reports
│   │   ├── AdminUsers.jsx                   # Admin user management
│   │   ├── AdminUniversities.jsx            # Admin university management
│   │   ├── AdminAnalytics.jsx               # System analytics with charts
│   │   └── NotFound.jsx                     # 404 page
│   ├── services/
│   │   ├── api.js                           # Axios instance with interceptors
│   │   ├── authService.js                   # Authentication APIs
│   │   ├── eventService.js                  # Event APIs
│   │   ├── blogService.js                   # Blog APIs
│   │   ├── gamificationService.js           # Leaderboard & badges APIs
│   │   ├── notificationService.js           # Notification APIs
│   │   ├── userService.js                   # User APIs
│   │   ├── adminService.js                  # Admin APIs
│   │   ├── reportService.js                 # Report APIs
│   │   └── websocketService.js              # WebSocket connection manager
│   ├── utils/
│   │   ├── constants.js                     # Constants (API URLs, enums)
│   │   └── helpers.js                       # Helper functions
│   ├── App.jsx                              # Main app with routing
│   ├── main.jsx                             # Entry point
│   └── index.css                            # Global styles
├── public/                                   # Static assets
├── package.json                             # Dependencies
├── vite.config.js                           # Vite configuration
└── FRONTEND_README.md                       # This file
```

---

## Core Features

### 1. Authentication System
- **JWT-based authentication**
- Token stored in localStorage
- Automatic token injection in API requests
- Auto-redirect on unauthorized access
- Role-based access control (Student, Supervisor, Admin)

**Implementation:**
- `AuthContext` provides authentication state globally
- `ProtectedRoute` component guards authenticated routes
- Axios interceptors handle token and errors

### 2. Real-Time Updates (WebSocket)
- **Badge Promotion Pop-ups** - Instant notification when earning badges
- **Leaderboard Updates** - Auto-refresh when points change
- **Dashboard Updates** - Refresh when user data changes

**Implementation:**
- `useWebSocket` hook manages subscriptions
- `BadgeModal` displays badge earned pop-up
- WebSocket topics:
  - `/topic/badge-promotion/{userId}`
  - `/topic/leaderboard-update`
  - `/topic/dashboard-update/{userId}`

### 3. Points & Gamification
- **Points Display** - Show current points and badge
- **Badge Progress** - Visual progress bars for locked badges
- **Leaderboard** - Members and Events rankings
- **Scope Toggle** - University vs Global leaderboard

**Points Awarded:**
- Event ORGANIZER: 50 points
- Event VOLUNTEER: 20 points
- Event ATTENDEE: 10 points
- Blog Approved (Student): 30 points
- Blog Approved (Supervisor): 50 points

### 4. Event Management
- **List Events** - Filter by status, type, search
- **Event Details** - View details and join
- **Create Event** - Propose new events
- **Join Events** - Choose role (Organizer/Volunteer/Attendee)
- **Approve Events** - Supervisor/Admin approval queue

### 5. Blog Management
- **List Blogs** - Filter by category, search
- **Create Blog** - Articles, Internships, Jobs
- **Global Visibility** - Option to make posts visible across universities
- **Approve Blogs** - Supervisor approval queue
- **Points on Approval** - Automatic points award

### 6. Dashboard
- **Stats Cards** - Points, badge, events count, blogs count
- **Recent Activity** - Latest events and blogs
- **Leaderboard Snippet** - Top 5 contributors
- **Notifications** - Recent 5 notifications
- **Quick Actions** - Create event/blog buttons
- **Supervisor View** - Pending approvals count

### 7. Notifications
- **Notification Types**:
  - BADGE_EARNED - Badge promotion
  - LEVEL_UP - Level promotion
  - EVENT_UPDATE - Event approval/cancellation
  - BLOG_APPROVAL - Blog approval/rejection
  - SYSTEM_ALERT - Admin announcements
- **Unread Count** - Badge in navbar
- **Mark as Read** - Individual and bulk actions

### 8. Admin Features
- **User Management** - View all users
- **University Management** - CRUD operations
- **System Analytics** - Charts and metrics
  - Total users, events, blogs
  - Active users
  - Pending approvals
  - Users by role

---

## Component Architecture

### Common Components

#### Navbar
- Dynamic menu based on user role
- Notification badge with unread count
- User dropdown with points display
- Role-specific menu items

#### Footer
- Links to key pages
- Contact information
- Copyright notice

#### BadgeModal
- WebSocket-triggered pop-up
- Animated badge display
- Configurable via Settings (can be disabled)

#### ProtectedRoute
- Guards authenticated routes
- Role-based access control
- Auto-redirect to login
- Access denied page for insufficient permissions

### Page Components

**Public Pages:**
- Home, Login, Register, Events (list), Blogs (list), Leaderboard, Badges

**Authenticated Pages:**
- Dashboard, Create Event, Create Blog, My Events, My Blogs, Notifications, Settings, Profile

**Supervisor/Admin Pages:**
- Event Approvals, Blog Approvals, Reports

**Admin Only Pages:**
- Admin Users, Admin Universities, Admin Analytics

---

## API Integration

### Base Configuration (`services/api.js`)

```javascript
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' }
});

// Request Interceptor - Add JWT token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('unihub_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor - Handle 401 errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Service Modules

Each service module exports methods for specific domain:

**authService:**
- `register(data)` - Register new user
- `login(email, password)` - Login and store token
- `logout()` - Clear session
- `getCurrentUser()` - Get user from localStorage

**eventService:**
- `getAllEvents(filters)` - Get events with filters
- `getEventById(id)` - Get event details
- `createEvent(data)` - Create new event
- `joinEvent(id, role)` - Join event with role
- `approveEvent(id)` - Approve event (Supervisor)

**blogService:**
- `getAllBlogs(filters)` - Get blogs with filters
- `createBlog(data)` - Create new blog
- `approveBlog(id)` - Approve blog (Supervisor)

**gamificationService:**
- `getLeaderboard(scope, type, universityId)` - Get rankings
- `getAllBadges()` - Get all badges
- `getMyBadges()` - Get user's badge progress

**notificationService:**
- `getNotifications(filters)` - Get notifications
- `getUnreadCount()` - Get unread count
- `markAsRead(id)` - Mark as read

---

## WebSocket Real-Time Updates

### Connection Setup

```javascript
import websocketService from '../services/websocketService';

// Connect on app load or after login
websocketService.connect(() => {
  console.log('WebSocket connected');
});

// Subscribe to badge promotions
websocketService.subscribeToBadgePromotions(userId, (badgeData) => {
  // Show BadgeModal pop-up
  setBadgeEarned(badgeData);
});

// Subscribe to leaderboard updates
websocketService.subscribeToLeaderboardUpdates(() => {
  // Refresh leaderboard
  loadLeaderboard();
});

// Cleanup on unmount
websocketService.disconnect();
```

### WebSocket Hook (`useWebSocket.js`)

Automatically manages subscriptions based on logged-in user:

```javascript
const { badgeEarned, leaderboardUpdated, dashboardUpdated } = useWebSocket();

// badgeEarned - Contains badge data when earned
// leaderboardUpdated - Boolean flag when leaderboard changes
// dashboardUpdated - Boolean flag when dashboard should refresh
```

### Badge Promotion Flow

```
User earns points (join event, blog approved)
  ↓
Backend: GamificationService.awardPoints()
  ↓
Backend checks badge threshold
  ↓
If new badge earned:
  ↓
Backend sends WebSocket message to /topic/badge-promotion/{userId}
  ↓
Frontend: useWebSocket receives message
  ↓
Frontend: BadgeModal shown with animation
  ↓
User sees "Congratulations!" pop-up
```

---

## Authentication Flow

### Registration Flow
```
User fills registration form
  ↓
POST /api/auth/register
  ↓
Backend creates user with default badge (Newcomer)
  ↓
Backend returns JWT token + user data
  ↓
Frontend stores token in localStorage
  ↓
Frontend connects WebSocket
  ↓
Redirect to /dashboard
```

### Login Flow
```
User enters email/password
  ↓
POST /api/auth/login
  ↓
Backend validates credentials
  ↓
Backend returns JWT token + user data
  ↓
Frontend stores token in localStorage
  ↓
Frontend connects WebSocket
  ↓
Redirect to /dashboard
```

### Token Handling
- Token included in all API requests via Axios interceptor
- Token stored in localStorage as `unihub_token`
- User data stored as `unihub_user`
- On 401 response, token cleared and user redirected to login

---

## Routing & Navigation

### Public Routes (No Authentication)
- `/` - Home/Landing page
- `/login` - Login page
- `/register` - Registration page
- `/events` - Events list
- `/blogs` - Blogs list
- `/leaderboard` - Leaderboard
- `/badges` - Badges showcase

### Protected Routes (Authentication Required)
- `/dashboard` - User dashboard
- `/events/new` - Create event
- `/events/:id` - Event details (can join if authenticated)
- `/blogs/new` - Create blog
- `/my-events` - User's events
- `/my-blogs` - User's blogs
- `/notifications` - Notifications center
- `/settings` - User settings
- `/profile/:id` - User profile

### Supervisor/Admin Routes
- `/events/approvals` - Event approval queue
- `/blogs/approvals` - Blog approval queue
- `/reports` - Content reports

### Admin Only Routes
- `/admin/users` - User management
- `/admin/universities` - University management
- `/admin/analytics` - System analytics

### Route Protection

```jsx
<ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
  <AdminUsers />
</ProtectedRoute>
```

---

## State Management

### Global State (React Context)

**AuthContext** - Authentication state
```javascript
{
  user: {
    userId, name, email, role, points, 
    universityId, universityName, currentBadgeName, token
  },
  login(email, password),
  register(data),
  logout(),
  updateUser(user),
  hasRole(role),
  isAuthenticated()
}
```

### Local State (Component State)
Each page manages its own state using React hooks:
- `useState` for component data
- `useEffect` for data loading
- `useWebSocket` for real-time updates

---

## API Integration Examples

### Creating an Event

```javascript
import eventService from '../services/eventService';

const handleCreateEvent = async (eventData) => {
  try {
    const event = await eventService.createEvent({
      title: "React Workshop",
      description: "Learn React",
      location: "Room 101",
      startDate: "2025-02-01T14:00:00",
      endDate: "2025-02-01T16:00:00",
      type: "Workshop"
    });
    console.log('Event created:', event);
  } catch (error) {
    console.error('Failed to create event:', error);
  }
};
```

### Joining an Event

```javascript
import { PARTICIPANT_ROLES } from '../utils/constants';

const handleJoinEvent = async (eventId) => {
  try {
    await eventService.joinEvent(eventId, PARTICIPANT_ROLES.VOLUNTEER);
    // User earns 20 points automatically
    // Badge check performed on backend
    // WebSocket notification sent if badge earned
  } catch (error) {
    console.error('Failed to join event:', error);
  }
};
```

### Fetching Leaderboard

```javascript
import { LEADERBOARD_SCOPES, LEADERBOARD_TYPES } from '../utils/constants';

const loadLeaderboard = async () => {
  const data = await gamificationService.getLeaderboard(
    LEADERBOARD_SCOPES.GLOBAL,  // or UNIVERSITY
    LEADERBOARD_TYPES.MEMBERS,  // or EVENTS
    null  // universityId if UNIVERSITY scope
  );
  setLeaderboardData(data.rankings);
};
```

---

## WebSocket Integration

### Connecting to WebSocket

```javascript
import websocketService from '../services/websocketService';

// Connect (typically in AuthContext after login)
websocketService.connect(() => {
  console.log('Connected to WebSocket');
});

// Subscribe to badge promotions
websocketService.subscribeToBadgePromotions(userId, (badgeData) => {
  // badgeData contains: badgeId, badgeName, badgeDescription, pointsThreshold
  showBadgeModal(badgeData);
});

// Disconnect (on logout)
websocketService.disconnect();
```

### Badge Promotion Pop-up

When backend sends badge promotion message:

```javascript
{
  "userId": 1,
  "badgeId": 2,
  "badgeName": "Explorer",
  "badgeDescription": "Earned 100 points",
  "pointsThreshold": 100,
  "timestamp": "2025-01-15T10:30:00"
}
```

Frontend automatically shows `BadgeModal` with animation.

---

## Helper Functions

### Date Formatting

```javascript
import { formatDate, getTimeAgo } from '../utils/helpers';

formatDate("2025-01-15T10:00:00");  
// → "January 15, 2025, 10:00 AM"

getTimeAgo("2025-01-15T10:00:00");  
// → "2 hours ago"
```

### Badge Colors

```javascript
import { getBadgeColor } from '../utils/helpers';

getBadgeColor("Explorer");  // → "info" (Bootstrap variant)
getBadgeColor("Champion");  // → "warning"
```

### Points Formatting

```javascript
import { formatPoints } from '../utils/helpers';

formatPoints(1234);  // → "1,234"
```

---

## Responsive Design

All pages are mobile-friendly using Bootstrap's responsive grid:

- **Mobile** - Single column layout
- **Tablet** - 2-column layout for cards
- **Desktop** - Multi-column dashboard layout

Navbar collapses to hamburger menu on mobile devices.

---

## Error Handling

### Global Error Handling
Axios interceptors catch API errors globally:
- 401 Unauthorized → Redirect to login
- 403 Forbidden → Log error
- Other errors → Propagate to component

### Component-Level Error Handling
Each page has local error state for user-friendly messages:

```javascript
const [error, setError] = useState('');

try {
  await someApiCall();
} catch (err) {
  setError(err.response?.data?.message || 'An error occurred');
}

// Display
{error && <Alert variant="danger">{error}</Alert>}
```

---

## Performance Optimization

### Lazy Loading
Non-critical pages are lazy-loaded:

```javascript
const EventDetails = lazy(() => import('./pages/EventDetails'));
```

Benefits:
- Faster initial load
- Smaller bundle size
- Better user experience

### WebSocket Connection Management
- Connect once after login
- Reuse same connection
- Auto-reconnect on disconnect
- Clean disconnection on logout

---

## Local Storage Usage

| Key | Value | Purpose |
|-----|-------|---------|
| `unihub_token` | JWT token | Authentication |
| `unihub_user` | User JSON | User data cache |
| `unihub_notifications_enabled` | "true"/"false" | Badge pop-up preference |

---

## Development Workflow

### Running Development Server

```bash
cd frontend
npm install
npm run dev
```

App runs on `http://localhost:5173`

### Building for Production

```bash
npm run build
```

Outputs to `dist/` folder

### Linting

```bash
npm run lint
```

---

## Integration with Backend

### API Base URL
```javascript
// utils/constants.js
export const API_BASE_URL = 'http://localhost:8080/api';
```

### WebSocket URL
```javascript
export const WS_BASE_URL = 'http://localhost:8080/ws';
```

### CORS Configuration
Backend must allow `http://localhost:5173` (configured in backend's application.properties)

---

## User Roles & Permissions

### Student
- Create events and blogs
- Join events
- View leaderboards
- Earn points and badges

### Supervisor
- All Student permissions
- Approve/reject events
- Approve/reject blogs
- View reports
- Earn 50 points per blog (vs 30 for students)

### Admin
- All Supervisor permissions
- Manage users
- Manage universities
- View system analytics

---

## Testing the Frontend

### Manual Testing Checklist

1. **Authentication**
   - [ ] Register new user
   - [ ] Login with credentials
   - [ ] Logout
   - [ ] Access protected route without login (should redirect)

2. **Events**
   - [ ] View events list
   - [ ] Create new event
   - [ ] Join event as different roles
   - [ ] Verify points awarded

3. **Blogs**
   - [ ] View blogs list
   - [ ] Create blog
   - [ ] Approve blog as supervisor
   - [ ] Verify points awarded

4. **Gamification**
   - [ ] Check leaderboard
   - [ ] Toggle between University/Global
   - [ ] Toggle between Members/Events
   - [ ] View badges with progress

5. **WebSocket**
   - [ ] Earn 100 points
   - [ ] Verify badge pop-up appears
   - [ ] Check leaderboard auto-updates

6. **Notifications**
   - [ ] View notifications
   - [ ] Mark as read
   - [ ] Check unread count in navbar

7. **Settings**
   - [ ] Change password
   - [ ] Toggle notification pop-ups
   - [ ] Verify preference saved

---

## Troubleshooting

### Common Issues

**Issue:** "Cannot connect to backend"
**Solution:** Ensure backend is running on `http://localhost:8080`

**Issue:** "WebSocket connection failed"
**Solution:** Check backend WebSocket configuration, ensure `/ws` endpoint accessible

**Issue:** "401 Unauthorized" on all requests
**Solution:** Token expired or invalid, logout and login again

**Issue:** "Badge pop-up not showing"
**Solution:** Check Settings page, ensure notifications enabled

**Issue:** "CORS error"
**Solution:** Backend must allow frontend origin in CORS configuration

---

## Future Enhancements

- [ ] Profile picture upload
- [ ] Rich text editor for blogs
- [ ] Event image uploads
- [ ] Advanced search with filters
- [ ] Pagination for large lists
- [ ] Dark mode toggle
- [ ] Email notifications
- [ ] Social sharing
- [ ] Export analytics to PDF
- [ ] Mobile app version

---

## Development Tips

1. **Use React DevTools** for debugging state
2. **Check Network tab** for API calls
3. **Monitor Console** for WebSocket messages
4. **Use Bootstrap components** for consistency
5. **Follow naming conventions** for maintainability

---

## Code Style

- Use functional components with hooks
- Use destructuring for props
- Use const for non-changing variables
- Use meaningful variable names
- Add comments for complex logic
- Handle loading and error states
- Use Bootstrap variants consistently

---

## Support & Documentation

- **Backend API:** See `../BACKEND_README.md`
- **API Testing:** See `../API_TESTING_GUIDE.md`
- **Full Setup:** See `../FULL_PROJECT_SETUP.md`
- **Backend Setup:** See `../SETUP.md`

---

## License

Part of UniHub university project.

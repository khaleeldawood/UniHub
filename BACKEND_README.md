# UniHub Backend - Comprehensive Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Database Design](#database-design)
4. [Backend Structure](#backend-structure)
5. [API Endpoints](#api-endpoints)
6. [Authentication & Authorization](#authentication--authorization)
7. [Points & Gamification System](#points--gamification-system)
8. [WebSocket Real-Time Updates](#websocket-real-time-updates)
9. [Setup Instructions](#setup-instructions)
10. [Business Logic Flows](#business-logic-flows)

---

## Project Overview

UniHub is a comprehensive university platform that connects students, supervisors, and administrators through a centralized hub for events, blogs, opportunities, and gamified engagement.

### Key Features
- **Event Management**: Create, approve, and participate in university events
- **Blog & Opportunities**: Publish articles, internships, and job opportunities
- **Gamification**: Points, badges, levels, and leaderboards
- **Multi-University Support**: Each university has its own portal with global content visibility
- **Real-Time Updates**: WebSocket-powered live dashboards and notifications
- **Role-Based Access**: Student, Supervisor, and Admin roles with specific permissions

### Technology Stack
- **Backend**: Spring Boot 3.5.7 (Java 17)
- **Database**: PostgreSQL
- **Security**: Spring Security + JWT
- **Real-Time**: Spring WebSocket (STOMP over SockJS)
- **Build Tool**: Maven
- **ORM**: Spring Data JPA
- **Utilities**: Lombok

---

## Architecture

### High-Level Architecture
```
┌─────────────────┐
│  React Frontend │
│   (Port 5173)   │
└────────┬────────┘
         │ REST API (JSON)
         │ WebSocket (STOMP)
         ↓
┌─────────────────┐
│  Spring Boot    │
│   Backend       │
│   (Port 8080)   │
├─────────────────┤
│ • Controllers   │
│ • Services      │
│ • Repositories  │
│ • Security      │
│ • WebSocket     │
└────────┬────────┘
         │ JDBC
         ↓
┌─────────────────┐
│   PostgreSQL    │
│    Database     │
└─────────────────┘
```

### Package Structure
```
com.example.unihub/
├── UnihubApplication.java              # Main application class
├── config/                              # Configuration classes
│   ├── SecurityConfig.java             # Spring Security configuration
│   ├── WebSocketConfig.java            # WebSocket configuration
│   └── CorsConfig.java                 # CORS configuration
├── model/                               # JPA Entities
│   ├── User.java
│   ├── University.java
│   ├── Event.java
│   ├── EventParticipant.java
│   ├── Blog.java
│   ├── PointsLog.java
│   ├── Badge.java
│   ├── UserBadge.java
│   ├── Notification.java
│   ├── BlogReport.java
│   └── EventReport.java
├── repository/                          # Data access layer
│   ├── UserRepository.java
│   ├── UniversityRepository.java
│   ├── EventRepository.java
│   ├── EventParticipantRepository.java
│   ├── BlogRepository.java
│   ├── PointsLogRepository.java
│   ├── BadgeRepository.java
│   ├── UserBadgeRepository.java
│   ├── NotificationRepository.java
│   ├── BlogReportRepository.java
│   └── EventReportRepository.java
├── service/                             # Business logic layer
│   ├── AuthService.java
│   ├── UserService.java
│   ├── EventService.java
│   ├── BlogService.java
│   ├── GamificationService.java
│   ├── NotificationService.java
│   ├── LeaderboardService.java
│   ├── ReportService.java
│   └── UniversityService.java
├── controller/                          # REST API endpoints
│   ├── AuthController.java
│   ├── UserController.java
│   ├── EventController.java
│   ├── BlogController.java
│   ├── GamificationController.java
│   ├── NotificationController.java
│   ├── AdminController.java
│   └── ReportController.java
├── dto/                                 # Data Transfer Objects
│   ├── request/
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   ├── CreateEventRequest.java
│   │   ├── CreateBlogRequest.java
│   │   └── ...
│   └── response/
│       ├── AuthResponse.java
│       ├── UserResponse.java
│       ├── EventResponse.java
│       └── ...
├── security/                            # Security components
│   ├── JwtUtil.java                    # JWT token utilities
│   ├── JwtAuthenticationFilter.java    # JWT validation filter
│   └── CustomUserDetailsService.java   # User details service
├── exception/                           # Exception handling
│   ├── GlobalExceptionHandler.java
│   ├── ResourceNotFoundException.java
│   └── UnauthorizedException.java
└── enums/                               # Enumerations
    ├── UserRole.java
    ├── EventStatus.java
    ├── BlogStatus.java
    ├── ParticipantRole.java
    ├── NotificationType.java
    └── ReportStatus.java
```

---

## Database Design

### Entity Relationship Diagram
```
Users (1) ←→ (N) UserBadges
Users (N) ←→ (1) Badges (current_badge)
Users (N) ←→ (1) Universities
Users (1) ←→ (N) Events (creator)
Users (1) ←→ (N) Blogs (author)
Users (1) ←→ (N) EventParticipants
Users (1) ←→ (N) PointsLog
Users (1) ←→ (N) Notifications
Events (N) ←→ (1) Universities
Events (1) ←→ (N) EventParticipants
Events (1) ←→ (N) EventReports
Blogs (N) ←→ (1) Universities (nullable for global)
Blogs (1) ←→ (N) BlogReports
```

### Tables Overview

#### 1. **users** Table
Stores all user accounts with role-based access and gamification tracking.

| Column | Type | Description |
|--------|------|-------------|
| user_id | BIGSERIAL PRIMARY KEY | Unique user identifier |
| university_id | BIGINT REFERENCES universities | User's university (nullable) |
| name | VARCHAR(255) NOT NULL | Full name |
| email | VARCHAR(255) UNIQUE NOT NULL | University email |
| password_hash | VARCHAR(255) NOT NULL | Encrypted password |
| role | VARCHAR(50) NOT NULL | STUDENT, SUPERVISOR, ADMIN |
| points | INTEGER DEFAULT 0 | Total points earned |
| current_badge_id | BIGINT REFERENCES badges | Current badge/level |
| created_at | TIMESTAMP DEFAULT NOW() | Registration date |
| updated_at | TIMESTAMP DEFAULT NOW() | Last update |

**Indexes**: email, university_id, points (for leaderboard queries)

#### 2. **user_badges** Table (New)
Historical record of all badges earned by users.

| Column | Type | Description |
|--------|------|-------------|
| user_badge_id | BIGSERIAL PRIMARY KEY | Unique record |
| user_id | BIGINT REFERENCES users | User who earned badge |
| badge_id | BIGINT REFERENCES badges | Badge earned |
| earned_at | TIMESTAMP DEFAULT NOW() | When badge was earned |

**Purpose**: Track badge progression history, separate from current badge.

#### 3. **universities** Table
University portals configuration.

| Column | Type | Description |
|--------|------|-------------|
| university_id | BIGSERIAL PRIMARY KEY | Unique university ID |
| name | VARCHAR(255) NOT NULL | University name |
| description | TEXT | Description |
| logo_url | VARCHAR(500) | University logo |
| created_at | TIMESTAMP DEFAULT NOW() | Creation date |
| updated_at | TIMESTAMP DEFAULT NOW() | Last update |

#### 4. **events** Table
Event proposals and approved events.

| Column | Type | Description |
|--------|------|-------------|
| event_id | BIGSERIAL PRIMARY KEY | Unique event ID |
| university_id | BIGINT REFERENCES universities | Event's university |
| title | VARCHAR(255) NOT NULL | Event title |
| description | TEXT | Event description |
| location | VARCHAR(255) | Event location |
| start_date | TIMESTAMP NOT NULL | Start datetime |
| end_date | TIMESTAMP NOT NULL | End datetime |
| type | VARCHAR(50) | Workshop, Seminar, etc. |
| status | VARCHAR(50) DEFAULT 'PENDING' | PENDING, APPROVED, CANCELLED |
| created_by | BIGINT REFERENCES users | Event creator |
| created_at | TIMESTAMP DEFAULT NOW() | Creation date |
| updated_at | TIMESTAMP DEFAULT NOW() | Last update |

**Indexes**: university_id, status, start_date

#### 5. **event_participants** Table
Tracks user participation in events.

| Column | Type | Description |
|--------|------|-------------|
| participant_id | BIGSERIAL PRIMARY KEY | Unique record |
| event_id | BIGINT REFERENCES events ON DELETE CASCADE | Associated event |
| user_id | BIGINT REFERENCES users ON DELETE CASCADE | Participant |
| role | VARCHAR(50) NOT NULL | ORGANIZER, VOLUNTEER, ATTENDEE |
| points_awarded | INTEGER | Points for this participation |
| joined_at | TIMESTAMP DEFAULT NOW() | Join timestamp |

**Unique Constraint**: (event_id, user_id) - User can join event only once

**Points Logic**:
- ORGANIZER: 50 points
- VOLUNTEER: 20 points
- ATTENDEE: 10 points

#### 6. **blogs** Table
Blog posts, internships, and job opportunities.

| Column | Type | Description |
|--------|------|-------------|
| blog_id | BIGSERIAL PRIMARY KEY | Unique blog ID |
| university_id | BIGINT REFERENCES universities | Blog's university (nullable for global) |
| author_id | BIGINT REFERENCES users | Blog author |
| title | VARCHAR(255) NOT NULL | Blog title |
| content | TEXT NOT NULL | Blog content |
| category | VARCHAR(50) | ARTICLE, INTERNSHIP, JOB |
| status | VARCHAR(50) DEFAULT 'PENDING' | PENDING, APPROVED, REJECTED |
| is_global | BOOLEAN DEFAULT FALSE | Global visibility flag |
| created_at | TIMESTAMP DEFAULT NOW() | Creation date |
| updated_at | TIMESTAMP DEFAULT NOW() | Last update |

**Indexes**: university_id, author_id, status, is_global

**Points Logic**:
- Student blog approved: 30 points
- Supervisor blog approved: 50 points

#### 7. **points_log** Table
Audit trail of all points earned.

| Column | Type | Description |
|--------|------|-------------|
| points_log_id | BIGSERIAL PRIMARY KEY | Unique log entry |
| user_id | BIGINT REFERENCES users | User earning points |
| source_type | VARCHAR(50) NOT NULL | EVENT, BLOG, OTHER |
| source_id | BIGINT | ID of source event/blog |
| points | INTEGER NOT NULL | Points awarded |
| description | TEXT | Optional description |
| created_at | TIMESTAMP DEFAULT NOW() | Timestamp |

**Purpose**: Complete audit trail for points, enables analytics and debugging.

#### 8. **badges** Table
Badge definitions with point thresholds.

| Column | Type | Description |
|--------|------|-------------|
| badge_id | BIGSERIAL PRIMARY KEY | Unique badge ID |
| name | VARCHAR(255) NOT NULL | Badge/Level name |
| description | TEXT | Requirements description |
| points_threshold | INTEGER NOT NULL | Points required |
| created_at | TIMESTAMP DEFAULT NOW() | Creation date |
| updated_at | TIMESTAMP DEFAULT NOW() | Last update |

**Example Badges**:
- Newcomer: 0 points
- Explorer: 100 points
- Contributor: 300 points
- Leader: 600 points
- Champion: 1000 points

#### 9. **notifications** Table
User notifications and alerts.

| Column | Type | Description |
|--------|------|-------------|
| notification_id | BIGSERIAL PRIMARY KEY | Unique notification ID |
| user_id | BIGINT REFERENCES users ON DELETE CASCADE | Recipient |
| message | TEXT NOT NULL | Notification message |
| type | VARCHAR(50) NOT NULL | Notification type |
| is_read | BOOLEAN DEFAULT FALSE | Read status |
| link_url | TEXT | Optional link to content |
| created_at | TIMESTAMP DEFAULT NOW() | Timestamp |

**Notification Types**:
- `LEVEL_UP`: User promoted to new level
- `BADGE_EARNED`: New badge earned
- `EVENT_UPDATE`: Event approved/cancelled
- `BLOG_APPROVAL`: Blog approved/rejected
- `SYSTEM_ALERT`: Admin announcements

#### 10. **blog_reports** Table
Content moderation for blogs.

| Column | Type | Description |
|--------|------|-------------|
| report_id | BIGSERIAL PRIMARY KEY | Unique report ID |
| blog_id | BIGINT REFERENCES blogs | Reported blog |
| reported_by | BIGINT REFERENCES users | Reporter |
| reason | TEXT NOT NULL | Report reason |
| status | VARCHAR(50) DEFAULT 'PENDING' | PENDING, REVIEWED, DISMISSED |
| created_at | TIMESTAMP DEFAULT NOW() | Report date |

#### 11. **event_reports** Table
Content moderation for events.

| Column | Type | Description |
|--------|------|-------------|
| report_id | BIGSERIAL PRIMARY KEY | Unique report ID |
| event_id | BIGINT REFERENCES events | Reported event |
| reported_by | BIGINT REFERENCES users | Reporter |
| reason | TEXT NOT NULL | Report reason |
| status | VARCHAR(50) DEFAULT 'PENDING' | PENDING, REVIEWED, DISMISSED |
| created_at | TIMESTAMP DEFAULT NOW() | Report date |

---

## Backend Structure

### 1. Model Layer (JPA Entities)

#### User Entity
```java
@Entity
@Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    
    @ManyToOne
    @JoinColumn(name = "university_id")
    private University university;
    
    private String name;
    private String email; // Unique
    private String passwordHash;
    
    @Enumerated(EnumType.STRING)
    private UserRole role; // STUDENT, SUPERVISOR, ADMIN
    
    private Integer points = 0;
    
    @ManyToOne
    @JoinColumn(name = "current_badge_id")
    private Badge currentBadge;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Relationships
    @OneToMany(mappedBy = "user")
    private List<UserBadge> earnedBadges;
    
    @OneToMany(mappedBy = "creator")
    private List<Event> createdEvents;
    
    @OneToMany(mappedBy = "author")
    private List<Blog> blogs;
}
```

#### Event Entity
```java
@Entity
@Table(name = "events")
public class Event {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long eventId;
    
    @ManyToOne
    @JoinColumn(name = "university_id")
    private University university;
    
    private String title;
    private String description;
    private String location;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String type;
    
    @Enumerated(EnumType.STRING)
    private EventStatus status; // PENDING, APPROVED, CANCELLED
    
    @ManyToOne
    @JoinColumn(name = "created_by")
    private User creator;
    
    @OneToMany(mappedBy = "event")
    private List<EventParticipant> participants;
}
```

#### Blog Entity
```java
@Entity
@Table(name = "blogs")
public class Blog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long blogId;
    
    @ManyToOne
    @JoinColumn(name = "university_id")
    private University university; // Nullable for global blogs
    
    @ManyToOne
    @JoinColumn(name = "author_id")
    private User author;
    
    private String title;
    private String content;
    private String category; // ARTICLE, INTERNSHIP, JOB
    
    @Enumerated(EnumType.STRING)
    private BlogStatus status; // PENDING, APPROVED, REJECTED
    
    private Boolean isGlobal = false;
}
```

### 2. Repository Layer

All repositories extend `JpaRepository<Entity, Long>` with custom query methods:

```java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByUniversityIdOrderByPointsDesc(Long universityId);
    List<User> findAllByOrderByPointsDesc();
}

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByUniversityIdAndStatus(Long universityId, EventStatus status);
    List<Event> findByStatus(EventStatus status);
    
    @Query("SELECT e FROM Event e LEFT JOIN e.participants p " +
           "GROUP BY e ORDER BY COUNT(p) DESC")
    List<Event> findTopEventsByParticipants();
}

public interface BadgeRepository extends JpaRepository<Badge, Long> {
    Optional<Badge> findTopByPointsThresholdLessThanEqualOrderByPointsThresholdDesc(Integer points);
}
```

### 3. Service Layer

#### GamificationService - Core Logic
```java
@Service
public class GamificationService {
    
    // Award points and check for badge promotion
    public void awardPoints(User user, int points, String sourceType, 
                           Long sourceId, String description) {
        // 1. Update user points
        user.setPoints(user.getPoints() + points);
        userRepository.save(user);
        
        // 2. Log points
        PointsLog log = new PointsLog();
        log.setUser(user);
        log.setSourceType(sourceType);
        log.setSourceId(sourceId);
        log.setPoints(points);
        log.setDescription(description);
        pointsLogRepository.save(log);
        
        // 3. Check badge promotion
        Badge newBadge = badgeRepository
            .findTopByPointsThresholdLessThanEqualOrderByPointsThresholdDesc(user.getPoints())
            .orElse(null);
            
        if (newBadge != null && !newBadge.equals(user.getCurrentBadge())) {
            // Promote user to new badge
            Badge oldBadge = user.getCurrentBadge();
            user.setCurrentBadge(newBadge);
            userRepository.save(user);
            
            // Record in user_badges history
            UserBadge userBadge = new UserBadge();
            userBadge.setUser(user);
            userBadge.setBadge(newBadge);
            userBadgeRepository.save(userBadge);
            
            // Create notification
            notificationService.createNotification(
                user, 
                "Congratulations! You've earned the " + newBadge.getName() + " badge!",
                NotificationType.BADGE_EARNED,
                "/badges"
            );
            
            // Send WebSocket update for pop-up
            webSocketService.sendBadgePromotion(user.getUserId(), newBadge);
        }
    }
}
```

#### EventService - Event Management
```java
@Service
public class EventService {
    
    // Join event as participant
    public void joinEvent(Long eventId, Long userId, ParticipantRole role) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            
        // Check if already joined
        if (eventParticipantRepository.existsByEventIdAndUserId(eventId, userId)) {
            throw new IllegalStateException("Already joined this event");
        }
        
        // Calculate points based on role
        int points = switch(role) {
            case ORGANIZER -> 50;
            case VOLUNTEER -> 20;
            case ATTENDEE -> 10;
        };
        
        // Create participant record
        EventParticipant participant = new EventParticipant();
        participant.setEvent(event);
        participant.setUser(user);
        participant.setRole(role);
        participant.setPointsAwarded(points);
        eventParticipantRepository.save(participant);
        
        // Award points
        gamificationService.awardPoints(
            user, points, "EVENT", eventId, 
            "Joined event as " + role
        );
        
        // Send WebSocket update
        webSocketService.sendLeaderboardUpdate();
    }
    
    // Approve event (Supervisor/Admin)
    public void approveEvent(Long eventId, Long supervisorId) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
            
        event.setStatus(EventStatus.APPROVED);
        eventRepository.save(event);
        
        // Notify creator
        notificationService.createNotification(
            event.getCreator(),
            "Your event '" + event.getTitle() + "' has been approved!",
            NotificationType.EVENT_UPDATE,
            "/events/" + eventId
        );
    }
}
```

#### BlogService - Blog Management
```java
@Service
public class BlogService {
    
    // Approve blog (Supervisor)
    public void approveBlog(Long blogId, Long supervisorId) {
        Blog blog = blogRepository.findById(blogId)
            .orElseThrow(() -> new ResourceNotFoundException("Blog not found"));
            
        blog.setStatus(BlogStatus.APPROVED);
        blogRepository.save(blog);
        
        // Calculate points based on author role
        User author = blog.getAuthor();
        int points = author.getRole() == UserRole.STUDENT ? 30 : 50;
        
        // Award points
        gamificationService.awardPoints(
            author, points, "BLOG", blogId,
            "Blog approved: " + blog.getTitle()
        );
        
        // Notify author
        notificationService.createNotification(
            author,
            "Your blog '" + blog.getTitle() + "' has been approved!",
            NotificationType.BLOG_APPROVAL,
            "/blogs/" + blogId
        );
    }
}
```

---

## API Endpoints

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user.

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john.doe@university.edu",
  "password": "SecurePassword123",
  "role": "STUDENT",
  "universityId": 1
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "userId": 1,
  "name": "John Doe",
  "email": "john.doe@university.edu",
  "role": "STUDENT",
  "points": 0
}
```

#### POST `/api/auth/login`
Authenticate user and return JWT token.

**Request Body**:
```json
{
  "email": "john.doe@university.edu",
  "password": "SecurePassword123"
}
```

**Response**: Same as register

#### POST `/api/auth/forgot-password`
Initiate password reset (email-based).

**Request Body**:
```json
{
  "email": "john.doe@university.edu"
}
```

### Event Endpoints

#### GET `/api/events`
List all events with filters.

**Query Parameters**:
- `universityId` (optional): Filter by university
- `status` (optional): PENDING, APPROVED, CANCELLED
- `type` (optional): Workshop, Seminar, etc.

**Response**:
```json
[
  {
    "eventId": 1,
    "title": "Tech Workshop",
    "description": "Learn Spring Boot",
    "location": "Building A, Room 101",
    "startDate": "2025-01-15T10:00:00",
    "endDate": "2025-01-15T12:00:00",
    "type": "Workshop",
    "status": "APPROVED",
    "universityName": "University of Example",
    "creatorName": "Jane Smith",
    "participantCount": 25
  }
]
```

#### GET `/api/events/{id}`
Get event details.

#### POST `/api/events`
Create new event proposal (requires authentication).

**Request Body**:
```json
{
  "title": "Spring Boot Workshop",
  "description": "Introduction to Spring Boot framework",
  "location": "Lab 301",
  "startDate": "2025-02-01T14:00:00",
  "endDate": "2025-02-01T16:00:00",
  "type": "Workshop"
}
```

#### POST `/api/events/{id}/join`
Join an event as participant.

**Request Body**:
```json
{
  "role": "VOLUNTEER"
}
```

**Points Awarded Automatically**:
- ORGANIZER: 50 points
- VOLUNTEER: 20 points
- ATTENDEE: 10 points

#### PUT `/api/events/{id}/approve` (Supervisor/Admin only)
Approve an event proposal.

#### PUT `/api/events/{id}/cancel` (Supervisor/Admin only)
Cancel an event and notify participants.

### Blog Endpoints

#### GET `/api/blogs`
List blogs with filters.

**Query Parameters**:
- `universityId` (optional): Filter by university
- `category` (optional): ARTICLE, INTERNSHIP, JOB
- `status` (optional): For supervisors to view pending
- `isGlobal` (optional): true/false

#### GET `/api/blogs/{id}`
Get blog details.

#### POST `/api/blogs`
Create new blog/opportunity post.

**Request Body**:
```json
{
  "title": "Software Engineering Internship at TechCorp",
  "content": "We're looking for talented students...",
  "category": "INTERNSHIP",
  "isGlobal": true
}
```

#### PUT `/api/blogs/{id}/approve` (Supervisor only)
Approve a blog post.

**Points Awarded**:
- Student author: 30 points
- Supervisor author: 50 points

#### PUT `/api/blogs/{id}/reject` (Supervisor only)
Reject a blog post with reason.

### Gamification Endpoints

#### GET `/api/gamification/leaderboard`
Get leaderboard rankings.

**Query Parameters**:
- `scope`: UNIVERSITY, GLOBAL
- `type`: MEMBERS, EVENTS
- `universityId` (required if scope=UNIVERSITY)

**Response (MEMBERS type)**:
```json
{
  "scope": "GLOBAL",
  "type": "MEMBERS",
  "rankings": [
    {
      "rank": 1,
      "userId": 5,
      "name": "Alice Johnson",
      "universityName": "Tech University",
      "points": 850,
      "currentBadge": "Leader"
    },
    {
      "rank": 2,
      "userId": 12,
      "name": "Bob Smith",
      "universityName": "State University",
      "points": 720,
      "currentBadge": "Contributor"
    }
  ]
}
```

**Response (EVENTS type)**:
```json
{
  "scope": "UNIVERSITY",
  "type": "EVENTS",
  "rankings": [
    {
      "rank": 1,
      "eventId": 3,
      "title": "Hackathon 2025",
      "participantCount": 150,
      "organizerName": "Student Association"
    }
  ]
}
```

#### GET `/api/gamification/badges`
List all badges with user's progress.

**Response**:
```json
[
  {
    "badgeId": 1,
    "name": "Newcomer",
    "description": "Join UniHub",
    "pointsThreshold": 0,
    "earned": true,
    "earnedAt": "2025-01-01T10:00:00"
  },
  {
    "badgeId": 2,
    "name": "Explorer",
    "description": "Earn 100 points",
    "pointsThreshold": 100,
    "earned": false,
    "earnedAt": null
  }
]
```

### Notification Endpoints

#### GET `/api/notifications`
Get user's notifications.

**Query Parameters**:
- `isRead` (optional): true/false
- `type` (optional): Filter by type

**Response**:
```json
[
  {
    "notificationId": 1,
    "message": "Congratulations! You've earned the Explorer badge!",
    "type": "BADGE_EARNED",
    "isRead": false,
    "linkUrl": "/badges",
    "createdAt": "2025-01-10T15:30:00"
  }
]
```

#### PUT `/api/notifications/{id}/read`
Mark notification as read.

### Admin Endpoints

#### GET `/api/admin/users`
List all users with filters.

#### PUT `/api/admin/users/{id}`
Update user details or deactivate.

#### GET `/api/admin/universities`
List all universities.

#### POST `/api/admin/universities`
Create new university portal.

#### GET `/api/admin/analytics`
Get system-wide analytics.

**Response**:
```json
{
  "totalUsers": 1250,
  "totalEvents": 89,
  "totalBlogs": 234,
  "totalUniversities": 5,
  "activeUsers": 450,
  "pendingApprovals": {
    "events": 12,
    "blogs": 8
  }
}
```

### Report Endpoints

#### POST `/api/reports/blogs/{id}`
Report a blog post.

#### POST `/api/reports/events/{id}`
Report an event.

#### GET `/api/reports/blogs` (Supervisor/Admin)
Get pending blog reports.

#### GET `/api/reports/events` (Supervisor/Admin)
Get pending event reports.

---

## Authentication & Authorization

### JWT Token Structure
```json
{
  "sub": "john.doe@university.edu",
  "userId": 1,
  "role": "STUDENT",
  "universityId": 1,
  "iat": 1704067200,
  "exp": 1704153600
}
```

### Role-Based Access Control

| Endpoint Pattern | Student | Supervisor | Admin |
|-----------------|---------|------------|-------|
| `/api/auth/**` | ✓ | ✓ | ✓ |
| `/api/events` (GET) | ✓ | ✓ | ✓ |
| `/api/events` (POST) | ✓ | ✓ | ✓ |
| `/api/events/{id}/

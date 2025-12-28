# UniHub Backend - Complete Change Log

## 📝 All Changes Made to Project

This document lists every file that was created, modified, or updated during the backend implementation.

---

## 📋 Summary

- **Files Modified:** 2
- **New Files Created:** 63
- **Total Changes:** 65 files

---

## 🔧 Modified Existing Files

### 1. `pom.xml` - Updated
**What Changed:**
- ✅ Added PostgreSQL driver dependency
- ✅ Added JWT dependencies (jjwt-api, jjwt-impl, jjwt-jackson version 0.12.3)
- ✅ Added spring-boot-starter-validation dependency

**Added Dependencies:**
```xml
<!-- PostgreSQL Driver -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>

<!-- JWT Dependencies -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.3</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>

<!-- Validation -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

**Why:** Required for database connectivity, JWT authentication, and input validation

---

### 2. `src/main/resources/application.properties` - Updated
**What Changed:**
- ✅ Added complete database configuration for PostgreSQL
- ✅ Added JWT secret and expiration configuration
- ✅ Added JPA/Hibernate settings
- ✅ Added CORS configuration
- ✅ Added logging configuration

**New Configuration:**
```properties
# Server Configuration
server.port=8080

# Database Configuration (PostgreSQL)
spring.datasource.url=jdbc:postgresql://localhost:5432/unihub_db
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA / Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.jdbc.time_zone=UTC

# JWT Configuration
jwt.secret=unihub_secret_key_change_this_in_production...
jwt.expiration=86400000

# CORS Configuration
cors.allowed.origins=http://localhost:5173

# Logging Configuration
logging.level.com.example.unihub=DEBUG
logging.level.org.springframework.security=DEBUG
```

**Why:** Essential configuration for database connection, security, and development

---

## ✨ New Files Created (63 files)

### Documentation Files (5 new files)

1. **BACKEND_README.md** ⭐ DETAILED TECHNICAL DOCS
   - Complete architecture overview
   - Database design with ERD
   - All entity descriptions
   - API endpoint documentation
   - Authentication & authorization flow
   - Points & gamification system explanation
   - WebSocket configuration
   - Business logic flows

2. **SETUP.md** ⭐ SETUP GUIDE
   - Prerequisites checklist
   - PostgreSQL installation (macOS, Linux, Windows)
   - Database creation steps
   - Application running instructions
   - API testing with cURL
   - Troubleshooting guide
   - Production checklist

3. **API_TESTING_GUIDE.md** ⭐ TESTING GUIDE
   - Step-by-step test scenarios
   - cURL examples for all endpoints
   - WebSocket testing instructions
   - Badge auto-promotion testing
   - Role-based access testing
   - Database verification queries
   - Integration test checklist

4. **IMPLEMENTATION_SUMMARY.md** ⭐ IMPLEMENTATION OVERVIEW
   - High-level summary of what was built
   - Requirements mapping
   - Technical decisions explained
   - Feature highlights
   - Complete checklist

5. **FILES_CREATED.md**
   - Complete file listing
   - Purpose of each file
   - Statistics and organization

6. **CHANGES.md** (this file)
   - Detailed change log
   - All modifications documented

---

### Enumerations (6 new files)

7. **src/main/java/com/example/unihub/enums/UserRole.java**
   - STUDENT, SUPERVISOR, ADMIN
   - Used for role-based access control

8. **src/main/java/com/example/unihub/enums/EventStatus.java**
   - PENDING, APPROVED, CANCELLED
   - Event approval workflow states

9. **src/main/java/com/example/unihub/enums/BlogStatus.java**
   - PENDING, APPROVED, REJECTED
   - Blog approval workflow states

10. **src/main/java/com/example/unihub/enums/ParticipantRole.java**
    - ORGANIZER (50 points), VOLUNTEER (20 points), ATTENDEE (10 points)
    - Determines points awarded

11. **src/main/java/com/example/unihub/enums/NotificationType.java**
    - LEVEL_UP, BADGE_EARNED, EVENT_UPDATE, BLOG_APPROVAL, SYSTEM_ALERT
    - Different notification categories

12. **src/main/java/com/example/unihub/enums/ReportStatus.java**
    - PENDING, REVIEWED, DISMISSED
    - Content moderation workflow

---

### JPA Entity Models (11 new files)

13. **src/main/java/com/example/unihub/model/University.java**
    - University portal entity
    - Fields: universityId, name, description, logoUrl, timestamps
    - Relationships: OneToMany with Users, Events, Blogs

14. **src/main/java/com/example/unihub/model/User.java**
    - User account entity
    - Fields: userId, name, email, passwordHash, role, points, currentBadge, timestamps
    - Relationships: ManyToOne with University and Badge, OneToMany with Events, Blogs, Notifications
    - **Key Field:** points (tracked for gamification)

15. **src/main/java/com/example/unihub/model/Badge.java**
    - Badge/level definition
    - Fields: badgeId, name, description, pointsThreshold, timestamps
    - Relationship: OneToMany with Users (current badge) and UserBadges
    - **Key Field:** pointsThreshold (determines when badge is earned)

16. **src/main/java/com/example/unihub/model/UserBadge.java** ⭐ NEW TABLE
    - Historical record of badges earned
    - Fields: userBadgeId, user, badge, earnedAt
    - Purpose: Track all badges user has ever earned (separate from current badge)

17. **src/main/java/com/example/unihub/model/Event.java**
    - Event entity
    - Fields: eventId, title, description, location, startDate, endDate, type, status, creator, university, timestamps
    - Relationships: ManyToOne with University and User, OneToMany with EventParticipants

18. **src/main/java/com/example/unihub/model/EventParticipant.java**
    - Event participation tracking
    - Fields: participantId, event, user, role, pointsAwarded, joinedAt
    - Unique constraint: (event_id, user_id) - user can join event only once
    - **Key Field:** pointsAwarded (stores points for this specific participation)

19. **src/main/java/com/example/unihub/model/Blog.java**
    - Blog/opportunity post
    - Fields: blogId, title, content, category, status, isGlobal, author, university, timestamps
    - **Key Field:** isGlobal (determines if visible across all universities)

20. **src/main/java/com/example/unihub/model/PointsLog.java**
    - Complete audit trail of points
    - Fields: pointsLogId, user, sourceType, sourceId, points, description, createdAt
    - Purpose: Track every point transaction for analytics and debugging

21. **src/main/java/com/example/unihub/model/Notification.java**
    - User notifications
    - Fields: notificationId, user, message, type, isRead, linkUrl, createdAt
    - Used for both in-app notifications and WebSocket pop-ups

22. **src/main/java/com/example/unihub/model/BlogReport.java**
    - Blog content moderation
    - Fields: reportId, blog, reportedBy, reason, status, createdAt
    - Allows users to report inappropriate content

23. **src/main/java/com/example/unihub/model/EventReport.java**
    - Event content moderation
    - Fields: reportId, event, reportedBy, reason, status, createdAt
    - Allows users to report inappropriate events

---

### Repository Interfaces (11 new files)

24. **src/main/java/com/example/unihub/repository/UserRepository.java**
    - Custom queries: findByEmail, leaderboard queries, count by role
    - **Key Methods:**
      - `findByUniversityUniversityIdOrderByPointsDesc()` - University leaderboard
      - `findAllByOrderByPointsDesc()` - Global leaderboard
      - `countActiveUsers()` - Users with points > 0

25. **src/main/java/com/example/unihub/repository/UniversityRepository.java**
    - Custom queries: findByName, existsByName

26. **src/main/java/com/example/unihub/repository/EventRepository.java**
    - Custom queries: filter by status, university, creator
    - **Key Methods:**
      - `findTopEventsByParticipantsCount()` - Global events leaderboard
      - `findTopEventsByParticipantsCountForUniversity()` - University events leaderboard

27. **src/main/java/com/example/unihub/repository/EventParticipantRepository.java**
    - Custom queries: check if joined, count participants
    - **Key Method:** `existsByEventEventIdAndUserUserId()` - Prevent duplicate joins

28. **src/main/java/com/example/unihub/repository/BlogRepository.java**
    - Custom queries: filter by status, category, university, global
    - **Key Method:** `findByUniversityOrGlobalAndStatus()` - Returns university + global blogs

29. **src/main/java/com/example/unihub/repository/PointsLogRepository.java**
    - Custom queries: user history, sum points
    - Purpose: Complete audit trail for analytics

30. **src/main/java/com/example/unihub/repository/BadgeRepository.java**
    - Custom queries: ordered by threshold, find qualifying badge
    - **Key Method:** `findTopByPointsThresholdLessThanEqualOrderByPointsThresholdDesc()` - Find highest badge user qualifies for

31. **src/main/java/com/example/unihub/repository/UserBadgeRepository.java**
    - Custom queries: user's badge history, check if earned
    - Purpose: Track all badges ever earned by user

32. **src/main/java/com/example/unihub/repository/NotificationRepository.java**
    - Custom queries: filter by read status, type, count unread
    - Supports notification panel functionality

33. **src/main/java/com/example/unihub/repository/BlogReportRepository.java**
    - Custom queries: pending reports, count by status

34. **src/main/java/com/example/unihub/repository/EventReportRepository.java**
    - Custom queries: pending reports, count by status

---

### Security Layer (3 new files)

35. **src/main/java/com/example/unihub/security/JwtUtil.java**
    - JWT token generation
    - Token validation
    - Extract claims (userId, role, universityId)
    - **Updated for jjwt 0.12.3 API** (parser(), verifyWith(), parseSignedClaims())

36. **src/main/java/com/example/unihub/security/CustomUserDetailsService.java**
    - Implements Spring Security UserDetailsService
    - Loads user by email
    - Creates Spring Security User with authorities (ROLE_*)

37. **src/main/java/com/example/unihub/security/JwtAuthenticationFilter.java**
    - OncePerRequestFilter implementation
    - Extracts JWT from Authorization header
    - Validates token and sets authentication in SecurityContext

---

### Configuration Classes (4 new files)

38. **src/main/java/com/example/unihub/config/SecurityConfig.java**
    - Spring Security configuration
    - Role-based access control rules:
      - `/api/auth/**` - Public
      - `/api/admin/**` - ADMIN only
      - `/api/events/*/approve` - SUPERVISOR, ADMIN
      - `/api/blogs/*/approve` - SUPERVISOR, ADMIN
      - All other `/api/**` - Authenticated
    - JWT filter integration
    - Password encoder (BCrypt)

39. **src/main/java/com/example/unihub/config/CorsConfig.java**
    - CORS configuration
    - Allows frontend at http://localhost:5173
    - Configures allowed methods, headers, credentials

40. **src/main/java/com/example/unihub/config/WebSocketConfig.java**
    - STOMP over SockJS configuration
    - Message broker setup (/topic, /queue)
    - Application destination prefix (/app)
    - WebSocket endpoint: /ws

41. **src/main/java/com/example/unihub/config/DataInitializer.java** ⭐ DATABASE SEEDING
    - Implements CommandLineRunner
    - Seeds 6 default badges on first run:
      - Newcomer (0 points)
      - Explorer (100 points)
      - Contributor (300 points)
      - Leader (600 points)
      - Champion (1000 points)
      - Legend (1500 points)
    - Seeds sample university: "Example University"

---

### Exception Handling (3 new files)

42. **src/main/java/com/example/unihub/exception/ResourceNotFoundException.java**
    - Custom exception for 404 errors
    - Used when entities not found (User, Event, Blog, etc.)

43. **src/main/java/com/example/unihub/exception/UnauthorizedException.java**
    - Custom exception for 401 errors
    - Used for authentication failures

44. **src/main/java/com/example/unihub/exception/GlobalExceptionHandler.java**
    - @RestControllerAdvice for centralized exception handling
    - Handles:
      - ResourceNotFoundException → 404
      - UnauthorizedException → 401
      - AccessDeniedException → 403
      - BadCredentialsException → 401
      - MethodArgumentNotValidException → 400 (validation errors)
      - IllegalArgumentException → 400
      - IllegalStateException → 409
      - Generic Exception → 500
    - Returns consistent ErrorResponse format

---

### Data Transfer Objects (6 new files)

**Request DTOs (5 files):**

45. **src/main/java/com/example/unihub/dto/request/LoginRequest.java**
    - Fields: email, password
    - Validation: @Email, @NotBlank

46. **src/main/java/com/example/unihub/dto/request/RegisterRequest.java**
    - Fields: name, email, password, role, universityId
    - Validation: @Email, @NotBlank, @Size, @NotNull
    - Used for user registration

47. **src/main/java/com/example/unihub/dto/request/CreateEventRequest.java**
    - Fields: title, description, location, startDate, endDate, type
    - Validation: @NotBlank, @NotNull, @Future (dates must be in future)

48. **src/main/java/com/example/unihub/dto/request/CreateBlogRequest.java**
    - Fields: title, content, category, isGlobal
    - Validation: @NotBlank, @Size

49. **src/main/java/com/example/unihub/dto/request/JoinEventRequest.java**
    - Field: role (ParticipantRole enum)
    - Validation: @NotNull
    - Determines points awarded

**Response DTOs (1 file):**

50. **src/main/java/com/example/unihub/dto/response/AuthResponse.java**
    - Fields: token, userId, name, email, role, points, universityId, universityName, currentBadgeName
    - Returned after successful login/register

---

### Service Layer (8 new files)

51. **src/main/java/com/example/unihub/service/GamificationService.java** ⭐ CORE GAMIFICATION
    - **Key Method:** `awardPoints()` - Awards points, logs, checks badge promotion
    - **Key Method:** `checkAndPromoteBadge()` - Auto-promotes when threshold crossed
    - **Logic Flow:**
      1. Update user points
      2. Create points log entry
      3. Find highest qualifying badge
      4. If new badge → Update current badge
      5. Create user_badges history record
      6. Create notification
      7. Send WebSocket for pop-up
    - **WebSocket Methods:**
      - `sendBadgePromotionNotification()` - Badge earned pop-up
      - `sendLeaderboardUpdate()` - Refresh leaderboard
      - `sendDashboardUpdate()` - Refresh dashboard

52. **src/main/java/com/example/unihub/service/AuthService.java**
    - User registration with default badge assignment
    - Login with JWT generation
    - Password encoding with BCrypt
    - Builds AuthResponse with user details

53. **src/main/java/com/example/unihub/service/EventService.java**
    - `createEvent()` - Create proposal (PENDING status)
    - `joinEvent()` - Join with role-based points (ORGANIZER=50, VOLUNTEER=20, ATTENDEE=10)
    - `approveEvent()` - Changes status to APPROVED, sends notification
    - `rejectEvent()` / `cancelEvent()` - With participant notifications
    - **Integration:** Calls GamificationService.awardPoints() on join

54. **src/main/java/com/example/unihub/service/BlogService.java**
    - `createBlog()` - Create post (PENDING status)
    - `approveBlog()` - Awards points based on author role (Student=30, Supervisor=50)
    - `rejectBlog()` - With notification
    - Handles global blog visibility (isGlobal flag)
    - **Integration:** Calls GamificationService.awardPoints() on approval

55. **src/main/java/com/example/unihub/service/LeaderboardService.java**
    - `getMembersLeaderboard()` - Users ranked by points (UNIVERSITY or GLOBAL scope)
    - `getEventsLeaderboard()` - Events ranked by participant count
    - `getTopMembers()` / `getTopEvents()` - For dashboard snippets
    - Scope validation (requires universityId for UNIVERSITY scope)

56. **src/main/java/com/example/unihub/service/NotificationService.java**
    - `createNotification()` - Create notification with type and link
    - `getUserNotifications()` - Get all notifications
    - `getUnreadNotifications()` - Filter unread
    - `markAsRead()` / `markAllAsRead()` - Update read status
    - `getUnreadCount()` - For notification badge

57. **src/main/java/com/example/unihub/service/UserService.java**
    - `getUserById()` / `getUserByEmail()` - Fetch user
    - `updateUser()` - Update profile
    - `changePassword()` - With old password verification
    - `getUserBadges()` - Historical badges earned
    - `getAllBadgesWithProgress()` - All badges with current points

58. **src/main/java/com/example/unihub/service/UniversityService.java**
    - CRUD operations for universities
    - Admin-only functionality
    - Name uniqueness validation

59. **src/main/java/com/example/unihub/service/ReportService.java**
    - `reportBlog()` / `reportEvent()` - Create report
    - `getPendingBlogReports()` / `getPendingEventReports()` - For supervisors
    - `reviewBlogReport()` / `dismissBlogReport()` - Update status
    - Similar methods for event reports

---

### REST Controllers (8 new files)

60. **src/main/java/com/example/unihub/controller/AuthController.java**
    - POST `/api/auth/register` - User registration
    - POST `/api/auth/login` - User login
    - POST `/api/auth/forgot-password` - Password reset (placeholder)

61. **src/main/java/com/example/unihub/controller/EventController.java**
    - GET `/api/events` - List with filters (universityId, status, type)
    - GET `/api/events/{id}` - Event details
    - POST `/api/events` - Create event
    - POST `/api/events/{id}/join` - Join event
    - PUT `/api/events/{id}/approve` - Approve (Supervisor/Admin)
    - PUT `/api/events/{id}/reject` - Reject with reason
    - PUT `/api/events/{id}/cancel` - Cancel with notifications
    - GET `/api/events/my-events` - User's created events
    - GET `/api/events/my-participations` - User's participations
    - GET `/api/events/{id}/participants` - Event participants list

62. **src/main/java/com/example/unihub/controller/BlogController.java**
    - GET `/api/blogs` - List with filters (universityId, category, status, isGlobal)
    - GET `/api/blogs/{id}` - Blog details
    - POST `/api/blogs` - Create blog
    - PUT `/api/blogs/{id}/approve` - Approve (Supervisor)
    - PUT `/api/blogs/{id}/reject` - Reject with reason
    - GET `/api/blogs/my-blogs` - User's blogs
    - GET `/api/blogs/pending` - Pending blogs for approval

63. **src/main/java/com/example/unihub/controller/GamificationController.java**
    - GET `/api/gamification/leaderboard` - Leaderboard (scope, type, universityId params)
    - GET `/api/gamification/top-members` - Top N members
    - GET `/api/gamification/top-events` - Top N events
    - GET `/api/gamification/badges` - All badges
    - GET `/api/gamification/my-badges` - User's progress with earned badges

64. **src/main/java/com/example/unihub/controller/NotificationController.java**
    - GET `/api/notifications` - List with filters (isRead, type)
    - GET `/api/notifications/unread-count` - Unread count
    - PUT `/api/notifications/{id}/read` - Mark single as read
    - PUT `/api/notifications/read-all` - Mark all as read

65. **src/main/java/com/example/unihub/controller/UserController.java**
    - GET `/api/users/me` - Current user profile
    - GET `/api/users/{id}` - User by ID
    - PUT `/api/users/me` - Update profile (name, email)
    - PUT `/api/users/change-password` - Change password

66. **src/main/java/com/example/unihub/controller/AdminController.java**
    - GET `/api/admin/users` - List users with filters
    - GET `/api/admin/users/{id}` - User details
    - PUT `/api/admin/users/{id}` - Update user
    - DELETE `/api/admin/users/{id}` - Deactivate user
    - GET `/api/admin/universities` - List universities
    - POST `/api/admin/universities` - Create university
    - PUT `/api/admin/universities/{id}` - Update university
    - DELETE `/api/admin/universities/{id}` - Delete university
    - GET `/api/admin/analytics` - System-wide metrics
      - Total users, events, blogs, universities
      - Active users count
      - Pending approvals
      - Users by role

67. **src/main/java/com/example/unihub/controller/ReportController.java**
    - POST `/api/reports/blogs/{id}` - Report blog
    - POST `/api/reports/events/{id}` - Report event
    - GET `/api/reports/blogs` - List blog reports (pending filter)
    - GET `/api/reports/events` - List event reports (pending filter)
    - PUT `/api/reports/blogs/{id}/review` - Mark reviewed
    - PUT `/api/reports/blogs/{id}/dismiss` - Dismiss report
    - PUT `/api/reports/events/{id}/review` - Mark reviewed
    - PUT `/api/reports/events/{id}/dismiss` - Dismiss report

---

## 🔄 Key Integration Points

### Points → Badge Flow
**Files Involved:**
1. EventService.joinEvent() or BlogService.approveBlog()
2. → Calls GamificationService.awardPoints()
3. → Updates User.points
4. → Creates PointsLog entry
5. → Calls GamificationService.checkAndPromoteBadge()
6. → Queries BadgeRepository for qualifying badge
7. → Updates User.currentBadge
8. → Creates UserBadge history record
9. → Creates Notification
10. → Sends WebSocket message

### Approval Workflow
**Files Involved:**
1. User creates Event/Blog (EventController/BlogController)
2. → EventService/BlogService creates entity with PENDING status
3. → Supervisor calls approve endpoint
4. → Service changes status to APPROVED
5. → NotificationService creates notification
6. → GamificationService awards points (blogs only)
7. → Badge check performed
8. → WebSocket updates sent

### Leaderboard Query
**Files Involved:**
1. Frontend calls /api/gamification/leaderboard
2. → GamificationController receives request
3. → LeaderboardService.getMembersLeaderboard() or getEventsLeaderboard()
4. → UserRepository.findByUniversityIdOrderByPointsDesc() or findAllByOrderByPointsDesc()
5. → EventRepository.findTopEventsByParticipantsCount() (for events)
6. → Returns ranked list to frontend

---

## 🎯 Requirements Traceability

### From PlanResources/5- Database.txt

| Requirement | Implemented In | Status |
|-------------|----------------|--------|
| users table | User.java | ✅ |
| user_badges table (NEW) | UserBadge.java | ✅ |
| universities table | University.java | ✅ |
| events table | Event.java | ✅ |
| event_participants table | EventParticipant.java | ✅ |
| blogs table | Blog.java | ✅ |
| points_log table | PointsLog.java | ✅ |
| badges table | Badge.java | ✅ |
| notifications table | Notification.java | ✅ |
| blog_reports table | BlogReport.java | ✅ |
| event_reports table | EventReport.java | ✅ |

### From PlanResources/2- Requirements & Analysis.txt

| Requirement ID | Description | Implemented In | Status |
|----------------|-------------|----------------|--------|
| AUTH-01, 02, 03 | Login, Register, Reset | AuthController, AuthService | ✅ |
| EV-01 to EV-07 | Event management | EventController, EventService | ✅ |
| BL-01 to BL-07 | Blog management | BlogController, BlogService | ✅ |
| GM-01 to GM-08 | Gamification | GamificationController, LeaderboardService, GamificationService | ✅ |
| AD-01 to AD-04 | Admin features | AdminController, UniversityService | ✅ |
| IN-01 to IN-07 | Integration points | GamificationService (badge auto-update) | ✅ |

### From PlanResources/4- Tech.txt

| Technology | Implementation | Status |
|------------|----------------|--------|
| Spring Boot 3.5.7 | pom.xml, all classes | ✅ |
| Spring Security | SecurityConfig, JWT classes | ✅ |
| Spring Data JPA | All repositories | ✅ |
| PostgreSQL | application.properties, models | ✅ |
| JWT | JwtUtil, filters | ✅ |
| WebSocket (STOMP) | WebSocketConfig, GamificationService | ✅ |
| Lombok | All models, services, controllers | ✅ |
| Maven | pom.xml | ✅ |

---

## 💡 Special Implementations

### 1. Badge Auto-Promotion (Critical Feature)
**Implemented in:** GamificationService.checkAndPromoteBadge()

**How it works:**
```java
// After every points update
Badge newBadge = badgeRepository
    .findTopByPointsThresholdLessThanEqualOrderByPointsThresholdDesc(user.getPoints())
    .orElse(null);

if (newBadge != null && !newBadge.equals(user.getCurrentBadge())) {
    // Promote user
    user.setCurrentBadge(newBadge);
    
    // Record in history
    UserBadge userBadge = new UserBadge();
    userBadge.setUser(user);
    userBadge.setBadge(newBadge);
    userBadgeRepository.save(userBadge);
    
    // Notify
    notificationService.createNotification(...);
    
    // WebSocket pop-up
    messagingTemplate.convertAndSend("/topic/badge-promotion/" + userId, payload);
}
```

### 2. Multi-University Blog Filtering
**Implemented in:** BlogRepository.findByUniversityOrGlobalAndStatus()

**Custom JPQL Query

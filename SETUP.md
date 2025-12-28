# UniHub Backend - Setup Guide

## Prerequisites

Before running the application, ensure you have the following installed:

1. **Java 17 or higher**
   ```bash
   java -version
   ```

2. **Maven 3.6+**
   ```bash
   mvn -version
   ```

3. **PostgreSQL 12 or higher**
   ```bash
   psql --version
   ```

4. **Git** (for version control)

---

## Database Setup

### 1. Install PostgreSQL

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download and install from [PostgreSQL official website](https://www.postgresql.org/download/windows/)

### 2. Create Database

Connect to PostgreSQL:
```bash
psql -U postgres
```

Create the database:
```sql
CREATE DATABASE unihub_db;
\q
```

### 3. Verify Database Configuration

Check `src/main/resources/application.properties` and update if needed:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/unihub_db
spring.datasource.username=postgres
spring.datasource.password=postgres
```

---

## Running the Application

### 1. Clone the Repository
```bash
git clone https://github.com/ahmedyraw/unihub.git
cd unihub
```

### 2. Build the Project
```bash
mvn clean install
```

### 3. Run the Application
```bash
mvn spring-boot:run
```

Or run the JAR file:
```bash
java -jar target/unihub-0.0.1-SNAPSHOT.jar
```

### 4. Verify Application Started

The application should start on `http://localhost:8080`

You should see logs indicating:
- Database tables created automatically (Hibernate DDL)
- DataInitializer has seeded badges and sample university
- Application is ready

---

## Testing the API

### Using cURL

#### 1. Register a New User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.edu",
    "password": "password123",
    "role": "STUDENT",
    "universityId": 1
  }'
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "userId": 1,
  "name": "John Doe",
  "email": "john.doe@example.edu",
  "role": "STUDENT",
  "points": 0,
  "universityId": 1,
  "universityName": "Example University",
  "currentBadgeName": "Newcomer"
}
```

#### 2. Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.edu",
    "password": "password123"
  }'
```

#### 3. Create an Event (Authenticated)
```bash
TOKEN="your_jwt_token_here"

curl -X POST http://localhost:8080/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Spring Boot Workshop",
    "description": "Learn Spring Boot framework",
    "location": "Building A, Room 101",
    "startDate": "2025-02-01T10:00:00",
    "endDate": "2025-02-01T12:00:00",
    "type": "Workshop"
  }'
```

#### 4. Get All Events
```bash
curl -X GET http://localhost:8080/api/events
```

#### 5. Get Leaderboard
```bash
curl -X GET "http://localhost:8080/api/gamification/leaderboard?scope=GLOBAL&type=MEMBERS"
```

#### 6. Get My Notifications
```bash
curl -X GET http://localhost:8080/api/notifications \
  -H "Authorization: Bearer $TOKEN"
```

---

## API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/forgot-password` | Request password reset | No |

### Event Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/events` | List all events | No | All |
| GET | `/events/{id}` | Get event details | No | All |
| POST | `/events` | Create new event | Yes | All |
| POST | `/events/{id}/join` | Join event | Yes | All |
| PUT | `/events/{id}/approve` | Approve event | Yes | Supervisor, Admin |
| PUT | `/events/{id}/reject` | Reject event | Yes | Supervisor, Admin |
| PUT | `/events/{id}/cancel` | Cancel event | Yes | Supervisor, Admin |
| GET | `/events/my-events` | Get my created events | Yes | All |
| GET | `/events/my-participations` | Get my participations | Yes | All |
| GET | `/events/{id}/participants` | Get event participants | No | All |

### Blog Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/blogs` | List all blogs | No | All |
| GET | `/blogs/{id}` | Get blog details | No | All |
| POST | `/blogs` | Create new blog | Yes | All |
| PUT | `/blogs/{id}/approve` | Approve blog | Yes | Supervisor, Admin |
| PUT | `/blogs/{id}/reject` | Reject blog | Yes | Supervisor, Admin |
| GET | `/blogs/my-blogs` | Get my blogs | Yes | All |
| GET | `/blogs/pending` | Get pending blogs | Yes | Supervisor, Admin |

### Gamification Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/gamification/leaderboard` | Get leaderboard | No |
| GET | `/gamification/top-members` | Get top members | No |
| GET | `/gamification/top-events` | Get top events | No |
| GET | `/gamification/badges` | Get all badges | No |
| GET | `/gamification/my-badges` | Get my badges progress | Yes |

### Notification Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/notifications` | Get my notifications | Yes |
| GET | `/notifications/unread-count` | Get unread count | Yes |
| PUT | `/notifications/{id}/read` | Mark as read | Yes |
| PUT | `/notifications/read-all` | Mark all as read | Yes |

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/me` | Get current user | Yes |
| GET | `/users/{id}` | Get user by ID | Yes |
| PUT | `/users/me` | Update profile | Yes |
| PUT | `/users/change-password` | Change password | Yes |

### Admin Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/admin/users` | List all users | Yes | Admin |
| GET | `/admin/users/{id}` | Get user details | Yes | Admin |
| PUT | `/admin/users/{id}` | Update user | Yes | Admin |
| DELETE | `/admin/users/{id}` | Deactivate user | Yes | Admin |
| GET | `/admin/universities` | List universities | Yes | Admin |
| POST | `/admin/universities` | Create university | Yes | Admin |
| PUT | `/admin/universities/{id}` | Update university | Yes | Admin |
| DELETE | `/admin/universities/{id}` | Delete university | Yes | Admin |
| GET | `/admin/analytics` | Get analytics | Yes | Admin |

### Report Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| POST | `/reports/blogs/{id}` | Report a blog | Yes | All |
| POST | `/reports/events/{id}` | Report an event | Yes | All |
| GET | `/reports/blogs` | Get blog reports | Yes | Supervisor, Admin |
| GET | `/reports/events` | Get event reports | Yes | Supervisor, Admin |
| PUT | `/reports/blogs/{id}/review` | Review blog report | Yes | Supervisor, Admin |
| PUT | `/reports/blogs/{id}/dismiss` | Dismiss blog report | Yes | Supervisor, Admin |
| PUT | `/reports/events/{id}/review` | Review event report | Yes | Supervisor, Admin |
| PUT | `/reports/events/{id}/dismiss` | Dismiss event report | Yes | Supervisor, Admin |

---

## WebSocket Endpoints

### Connection
```javascript
const socket = new SockJS('http://localhost:8080/ws');
const stompClient = Stomp.over(socket);

stompClient.connect({}, function(frame) {
    console.log('Connected: ' + frame);
    
    // Subscribe to badge promotions
    stompClient.subscribe('/topic/badge-promotion/' + userId, function(message) {
        const badge = JSON.parse(message.body);
        showBadgePopup(badge);
    });
    
    // Subscribe to leaderboard updates
    stompClient.subscribe('/topic/leaderboard-update', function(message) {
        refreshLeaderboard();
    });
    
    // Subscribe to dashboard updates
    stompClient.subscribe('/topic/dashboard-update/' + userId, function(message) {
        refreshDashboard();
    });
});
```

### Topics

| Topic | Description | When Triggered |
|-------|-------------|----------------|
| `/topic/badge-promotion/{userId}` | Badge earned notification | User earns new badge |
| `/topic/leaderboard-update` | Leaderboard changed | Points awarded to any user |
| `/topic/dashboard-update/{userId}` | User dashboard needs refresh | User's data changed |

---

## Testing Workflow

### Complete Flow Test

1. **Register Users**
   - Register a student: john.doe@example.edu
   - Register a supervisor: supervisor@example.edu
   - Register an admin: admin@example.edu

2. **Login as Student**
   - Get JWT token
   - Create an event proposal

3. **Login as Supervisor**
   - View pending events
   - Approve the event

4. **Login as Student Again**
   - Check notifications (should have approval notification)
   - Join the approved event as VOLUNTEER (should earn 20 points)
   - Check if badge was auto-promoted

5. **Create and Approve Blog**
   - Student creates blog
   - Supervisor approves blog
   - Student earns 30 points
   - Check for badge promotion if threshold crossed

6. **Check Leaderboard**
   - View global members leaderboard
   - View university members leaderboard
   - View events leaderboard

7. **WebSocket Test**
   - Connect to WebSocket
   - Subscribe to badge promotion topic
   - Earn enough points to trigger badge
   - Verify pop-up notification received

---

## Database Schema

The application automatically creates the following tables:

- `users` - User accounts and profiles
- `user_badges` - Historical badge records
- `universities` - University portals
- `events` - Events and proposals
- `event_participants` - Event participation records
- `blogs` - Blog posts and opportunities
- `points_log` - Points audit trail
- `badges` - Badge definitions
- `notifications` - User notifications
- `blog_reports` - Blog moderation reports
- `event_reports` - Event moderation reports

### Default Data Seeded

**Badges:**
- Newcomer (0 points)
- Explorer (100 points)
- Contributor (300 points)
- Leader (600 points)
- Champion (1000 points)
- Legend (1500 points)

**Universities:**
- Example University (ID: 1)

---

## Points System

### Event Participation
- **ORGANIZER**: 50 points
- **VOLUNTEER**: 20 points
- **ATTENDEE**: 10 points

### Blog/Opportunity Approval
- **Student author**: 30 points
- **Supervisor author**: 50 points

### Badge Auto-Promotion

When a user earns points:
1. Total points are updated
2. System checks if user qualifies for higher badge
3. If yes:
   - Current badge is updated
   - Badge is recorded in user_badges history
   - Notification is created
   - WebSocket message sent for pop-up

---

## Troubleshooting

### Application Won't Start

**Issue: Database connection error**
```
Caused by: org.postgresql.util.PSQLException: Connection refused
```

**Solution:**
- Ensure PostgreSQL is running: `brew services start postgresql@14` (macOS)
- Verify database exists: `psql -U postgres -l`
- Check credentials in `application.properties`

### JWT Token Errors

**Issue: Token validation failing**

**Solution:**
- Ensure JWT secret is at least 256 bits (32 characters)
- Check token expiration time
- Verify Authorization header format: `Bearer <token>`

### CORS Errors

**Issue: Frontend can't connect to backend**

**Solution:**
- Update `cors.allowed.origins` in `application.properties`
- Add your frontend URL (default: `http://localhost:5173`)

### WebSocket Connection Failed

**Issue: WebSocket handshake error**

**Solution:**
- Verify WebSocket endpoint: `/ws`
- Check if STOMP over SockJS is properly configured
- Ensure CORS allows WebSocket connections

---

## Development Tips

### Hot Reload

The application uses Spring Boot DevTools for automatic restart on code changes.

### Logging

Debug logs are enabled for:
- Application: `logging.level.com.example.unihub=DEBUG`
- Security: `logging.level.org.springframework.security=DEBUG`

### Database Changes

The application uses `spring.jpa.hibernate.ddl-auto=update` which automatically updates schema on entity changes.

**For production, use:**
```properties
spring.jpa.hibernate.ddl-auto=validate
```
And manage schema with migration tools like Flyway or Liquibase.

---

## Project Structure Summary

```
src/main/java/com/example/unihub/
├── UnihubApplication.java          # Main application
├── config/                          # Configuration
│   ├── SecurityConfig.java         # Security & JWT config
│   ├── WebSocketConfig.java        # WebSocket config
│   ├── CorsConfig.java             # CORS config
│   └── DataInitializer.java        # Database seeding
├── model/                           # JPA Entities (10 tables)
├── repository/                      # Data access (10 repositories)
├── service/                         # Business logic (8 services)
├── controller/                      # REST APIs (7 controllers)
├── dto/                             # Request/Response DTOs
├── security/                        # JWT utilities & filters
├── exception/                       # Exception handling
└── enums/                           # Enumerations
```

---

## Next Steps

1. **Set up Frontend**: Navigate to `frontend/` directory and run `npm install && npm run dev`

2. **Create More Sample Data**: Use the API to create additional universities, users, events, and blogs

3. **Test WebSocket**: Connect from frontend and test real-time updates

4. **Configure Email**: Implement forgot-password functionality with email service

5. **Add File Upload**: Extend Blog/Event entities to support image uploads

6. **Implement Search**: Add full-text search for blogs and events

7. **Add Pagination**: Implement pagination for large data lists

8. **Metrics & Monitoring**: Add Spring Boot Actuator for health checks

---

## Production Checklist

Before deploying to production:

- [ ] Change JWT secret to a secure random string
- [ ] Set `spring.jpa.hibernate.ddl-auto=validate`
- [ ] Configure production database (not localhost)
- [ ] Set up proper CORS origins
- [ ] Enable HTTPS
- [ ] Configure email service for notifications
- [ ] Set up logging to file or external service
- [ ] Add database backup strategy
- [ ] Implement rate limiting
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Set up CI/CD pipeline
- [ ] Configure monitoring and alerts

---

## Support

For issues or questions:
- Check logs in console output
- Review BACKEND_README.md for detailed architecture
- Check database with: `psql -U postgres -d unihub_db`
- Verify API responses with Postman or cURL

---

## License

This project is part of a university coursework.

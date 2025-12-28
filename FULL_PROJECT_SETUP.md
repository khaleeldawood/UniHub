# UniHub - Complete Project Setup Guide

This guide covers the complete setup of both backend (Spring Boot) and frontend (React) for the UniHub platform.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Running the Complete Application](#running-the-complete-application)
6. [Testing End-to-End](#testing-end-to-end)
7. [Troubleshooting](#troubleshooting)
8. [Project Architecture](#project-architecture)

---

## Prerequisites

Before starting, ensure you have the following installed:

### Required Software

1. **Java 17 or higher**
   ```bash
   java -version
   # Should show: java version "17" or higher
   ```

2. **Node.js 18 or higher**
   ```bash
   node -version
   # Should show: v18.x.x or higher
   ```

3. **npm 9 or higher**
   ```bash
   npm -version
   # Should show: 9.x.x or higher
   ```

4. **PostgreSQL 12 or higher**
   ```bash
   psql --version
   # Should show: psql (PostgreSQL) 12.x or higher
   ```

5. **Git** (for version control)
   ```bash
   git --version
   ```

---

## Quick Start

For experienced developers who want to start quickly:

```bash
# 1. Create database
createdb unihub_db

# 2. Start backend (from project root)
./mvnw spring-boot:run

# 3. In new terminal, start frontend
cd frontend
npm install
npm run dev

# 4. Access application
# Frontend: http://localhost:5173
# Backend API: http://localhost:8080/api
```

---

## Backend Setup

### Step 1: Install PostgreSQL

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
Download from [PostgreSQL official website](https://www.postgresql.org/download/windows/)

### Step 2: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE unihub_db;

# Verify database created
\l

# Exit
\q
```

### Step 3: Configure Database Connection

Open `src/main/resources/application.properties` and verify:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/unihub_db
spring.datasource.username=postgres
spring.datasource.password=postgres
```

**Update username/password if different on your system.**

### Step 4: Build Backend

```bash
# From project root
./mvnw clean install
```

This will:
- Download all dependencies
- Compile Java code
- Run tests
- Create JAR file in `target/` folder

### Step 5: Run Backend

```bash
./mvnw spring-boot:run
```

**Expected Output:**
```
Started UnihubApplication in X.XXX seconds
```

**Verify backend is running:**
```bash
curl http://localhost:8080/api/gamification/badges
```

Should return 6 default badges (Newcomer, Explorer, Contributor, Leader, Champion, Legend).

---

## Frontend Setup

### Step 1: Navigate to Frontend Directory

```bash
cd frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- React 19
- React Router
- Bootstrap & React Bootstrap
- Axios
- SockJS & STOMP.js
- Recharts
- And other dependencies

**Installation time:** ~2-3 minutes depending on internet speed

### Step 3: Verify Configuration

Check `src/utils/constants.js`:

```javascript
export const API_BASE_URL = 'http://localhost:8080/api';
export const WS_BASE_URL = 'http://localhost:8080/ws';
```

These should match your backend URLs.

### Step 4: Run Frontend

```bash
npm run dev
```

**Expected Output:**
```
  VITE v7.2.2  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Access the application:**
Open browser and navigate to `http://localhost:5173`

---

## Running the Complete Application

### Terminal Setup (2 Terminals Required)

**Terminal 1 - Backend:**
```bash
cd /path/to/unihub
./mvnw spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd /path/to/unihub/frontend
npm run dev
```

### Verification Checklist

✅ **Backend Running:**
- Backend terminal shows "Started UnihubApplication"
- Can access: `http://localhost:8080/api/gamification/badges`
- Returns JSON with 6 badges

✅ **Frontend Running:**
- Frontend terminal shows "Local: http://localhost:5173/"
- Can access: `http://localhost:5173`
- See UniHub landing page

✅ **Database Connected:**
- Backend logs show: "HikariPool-1 - Start completed"
- No connection errors in backend logs

✅ **WebSocket Working:**
- Browser console (F12) shows no WebSocket errors
- On login, console shows "WebSocket Connected"

---

## Testing End-to-End

### Complete User Flow Test

#### 1. Register a Student

1. Go to `http://localhost:5173`
2. Click "Register"
3. Fill form:
   - Name: Test Student
   - Email: student@test.edu
   - University: Example University
   - Role: Student
   - Password: password123
4. Click "Register"
5. Should redirect to Dashboard
6. Check: Points = 0, Badge = "Newcomer"

#### 2. Create an Event

1. From Dashboard, click "Create Event"
2. Fill form:
   - Title: React Workshop
   - Description: Learn React basics
   - Location: Lab 101
   - Type: Workshop
   - Start Date: Tomorrow at 2 PM
   - End Date: Tomorrow at 4 PM
3. Click "Create Event"
4. Should redirect to My Events
5. Event status: PENDING (awaiting approval)

#### 3. Register a Supervisor

1. Logout (from user dropdown)
2. Go to Register page
3. Fill form with role: Supervisor
4. Email: supervisor@test.edu
5. Register and login

#### 4. Approve the Event

1. From navbar, go to "Event Approvals"
2. See the React Workshop event
3. Click "Approve"
4. Event status changes to APPROVED

#### 5. Join Event and Earn Points

1. Logout, login as student@test.edu
2. Check Notifications - should have "Event approved" notification
3. Go to Events page
4. Click on React Workshop event
5. Click "Volunteer (20 pts)"
6. Confirm join
7. **Check Dashboard - Points should be 20**
8. Badge should still be "Newcomer" (need 100 for Explorer)

#### 6. Create and Approve Blog

1. As student, go to "Create Post"
2. Fill blog form (Article category)
3. Submit blog (status: PENDING)
4. Logout, login as supervisor
5. Go to "Blog Approvals"
6. Approve the blog
7. Logout, login as student
8. **Check Dashboard - Points should be 50 (20 + 30)**

#### 7. Earn Explorer Badge

1. As student, join 2 more events as VOLUNTEER (20 pts each)
2. Total: 50 + 40 = 90 points
3. Join another event as ATTENDEE (10 pts)
4. Total: 90 + 10 = 100 points
5. **🎉 Badge Modal should pop up!**
6. "Congratulations! You've earned the Explorer badge!"
7. Check Dashboard - Badge = "Explorer"
8. Check Notifications - "You've earned the Explorer badge!"
9. Check Badges page - Explorer should show "✓ Earned"

#### 8. Test Leaderboard

1. Go to Leaderboard page
2. Toggle between "Members" and "Events"
3. Toggle between "My University" and "Global"
4. Student should appear with 100 points and Explorer badge

---

## Troubleshooting

### Backend Issues

**Problem:** `Connection refused` to PostgreSQL
```
Solution:
1. Check if PostgreSQL is running: 
   brew services list (macOS)
   sudo systemctl status postgresql (Linux)
2. Verify database exists: psql -U postgres -l
3. Check credentials in application.properties
```

**Problem:** `Port 8080 already in use`
```
Solution:
1. Find process: lsof -i :8080
2. Kill process: kill -9 <PID>
3. Or change port in application.properties
```

**Problem:** Maven command not found
```
Solution:
Use Maven wrapper: ./mvnw instead of mvn
```

### Frontend Issues

**Problem:** `npm install` fails
```
Solution:
1. Clear npm cache: npm cache clean --force
2. Delete node_modules: rm -rf node_modules
3. Delete package-lock.json: rm package-lock.json
4. Reinstall: npm install
```

**Problem:** "Cannot GET /api/..."
```
Solution:
1. Verify backend is running
2. Check API_BASE_URL in constants.js
3. Open browser console, check exact error
```

**Problem:** WebSocket not connecting
```
Solution:
1. Check backend logs for WebSocket errors
2. Verify WS_BASE_URL in constants.js
3. Try http instead of https
4. Check browser console for STOMP errors
```

**Problem:** Badge modal not showing
```
Solution:
1. Go to Settings, check notifications toggle
2. Check browser console for WebSocket messages
3. Verify badge threshold crossed (need 100 pts for Explorer)
```

### Database Issues

**Problem:** Tables not created
```
Solution:
1. Check backend logs for Hibernate errors
2. Verify spring.jpa.hibernate.ddl-auto=update
3. Check database user has CREATE permissions
```

**Problem:** No default badges
```
Solution:
1. Check backend logs for DataInitializer
2. Manually insert badges:
   psql -U postgres -d unihub_db
   INSERT INTO badges (name, description, points_threshold) 
   VALUES ('Newcomer', 'Welcome!', 0);
```

---

## Project Architecture

### High-Level Overview

```
┌─────────────────────┐
│   React Frontend    │
│  (Vite + Bootstrap) │
│  Port: 5173         │
└──────────┬──────────┘
           │
           │ REST API (JSON)
           │ WebSocket (STOMP)
           │
┌──────────▼──────────┐
│   Spring Boot       │
│   Backend           │
│   Port: 8080        │
└──────────┬──────────┘
           │
           │ JDBC
           │
┌──────────▼──────────┐
│   PostgreSQL        │
│   Database          │
│   Port: 5432        │
└─────────────────────┘
```

### Communication Flow

**1. API Requests:**
```
Frontend (Axios) → Backend (REST Controller) → Service → Repository → Database
```

**2. WebSocket Updates:**
```
Database Change → Service → WebSocket Message → Frontend (STOMP) → UI Update
```

**3. Authentication:**
```
Login → JWT Token Generated → Stored in localStorage → Sent with every request
```

---

## File Count Summary

### Backend
- **Java Files:** 60+
- **Configuration Files:** 4
- **Properties:** 1
- **Documentation:** 5

### Frontend
- **React Components:** 30+
- **Services:** 7
- **Pages:** 20+
- **Utilities:** 3
- **Documentation:** 1

### Total Project Files
- **Source Code:** 90+ files
- **Documentation:** 6 files
- **Configuration:** 5 files

---

## Default Data Seeded

### Badges (6)
1. Newcomer - 0 points
2. Explorer - 100 points
3. Contributor - 300 points
4. Leader - 600 points
5. Champion - 1000 points
6. Legend - 1500 points

### Universities (1)
- Example University (ID: 1)

### Users
None - Must register via frontend

---

## Points System Reference

### Event Participation
| Role | Points Earned |
|------|---------------|
| ORGANIZER | 50 |
| VOLUNTEER | 20 |
| ATTENDEE | 10 |

### Blog Approval
| Author Role | Points Earned |
|-------------|---------------|
| Student | 30 |
| Supervisor | 50 |

### Badge Unlock Flow
```
Points Earned → Updated in Database → Badge Check → 
If Threshold Crossed → Current Badge Updated → 
UserBadge History Created → Notification Created → 
WebSocket Message Sent → Frontend Shows Pop-up
```

---

## Deployment Considerations

### Production Checklist

**Backend:**
- [ ] Change JWT secret to secure random string
- [ ] Set `spring.jpa.hibernate.ddl-auto=validate`
- [ ] Use production PostgreSQL instance
- [ ] Enable HTTPS
- [ ] Configure proper CORS origins
- [ ] Set up logging to file
- [ ] Add monitoring (Spring Boot Actuator)

**Frontend:**
- [ ] Update API_BASE_URL to production backend
- [ ] Build for production: `npm run build`
- [ ] Deploy `dist/` folder to web server
- [ ] Configure HTTPS
- [ ] Set up CDN for static assets
- [ ] Enable gzip compression

**Database:**
- [ ] Use managed PostgreSQL (AWS RDS, etc.)
- [ ] Set up automated backups
- [ ] Configure connection pooling
- [ ] Set up read replicas if needed

---

## Development Tips

### Hot Reload
- Backend: Spring Boot DevTools auto-restarts on code changes
- Frontend: Vite HMR updates instantly without page refresh

### Debugging
- Backend: Check console logs, set breakpoints in IDE
- Frontend: Use React DevTools, check Network tab, monitor Console

### Database Inspection
```bash
# Connect to database
psql -U postgres -d unihub_db

# List tables
\dt

# View users
SELECT user_id, name, email, role, points FROM users;

# View points log
SELECT * FROM points_log ORDER BY created_at DESC LIMIT 10;

# View notifications
SELECT * FROM notifications ORDER BY created_at DESC LIMIT 10;
```

---

## Common Workflows

### Adding a New API Endpoint

1. **Backend:**
   - Add method to Controller
   - Implement logic in Service
   - Add repository query if needed
   - Test with cURL

2. **Frontend:**
   - Add method to appropriate service (e.g., eventService.js)
   - Use in component with useState/useEffect
   - Handle loading and error states

### Adding a New Page

1. **Create page component** in `frontend/src/pages/`
2. **Add route** in `App.jsx`
3. **Add navigation link** in `Navbar.jsx` (if needed)
4. **Test navigation** and functionality

---

## Environment Variables

### Backend (application.properties)
```properties
server.port=8080
spring.datasource.url=jdbc:postgresql://localhost:5432/unihub_db
spring.datasource.username=postgres
spring.datasource.password=postgres
jwt.secret=your-secret-key
jwt.expiration=86400000
cors.allowed.origins=http://localhost:5173
```

### Frontend (src/utils/constants.js)
```javascript
export const API_BASE_URL = 'http://localhost:8080/api';
export const WS_BASE_URL = 'http://localhost:8080/ws';
```

---

## Port Configuration

| Service | Default Port | Configurable In |
|---------|--------------|-----------------|
| Frontend | 5173 | vite.config.js |
| Backend | 8080 | application.properties |
| PostgreSQL | 5432 | PostgreSQL config |
| WebSocket | 8080/ws | Same as backend |

---

## Security Considerations

### Development (Current Setup)
- JWT secret is simple string (OK for dev)
- CORS allows localhost:5173 (OK for dev)
- Passwords stored with BCrypt (GOOD)
- SQL injection prevented by JPA (GOOD)

### Production (Must Change)
- Use strong JWT secret (256+ bits)
- Restrict CORS to production domain only
- Use HTTPS for all communications
- Set secure cookie flags
- Enable rate limiting
- Add CSRF protection for state-changing operations

---

## Testing Strategy

### Unit Tests
- **Backend:** JUnit tests in `src/test/java/`
- **Frontend:** Jest/React Testing Library (to be added)

### Integration Tests
- Test complete flows (register → create event → approve → join → earn points)
- Verify WebSocket notifications
- Test role-based access control

### Manual Testing
Follow the "Testing End-to-End" section above

---

## Performance Benchmarks

Expected performance on modern hardware:

| Metric | Value |
|--------|-------|
| Backend startup | 5-10 seconds |
| Frontend startup | 1-2 seconds |
| API response time | 50-200ms |
| WebSocket latency | 10-50ms |
| Badge pop-up delay | <100ms |
| Leaderboard load | 100-300ms |

---

## Monitoring & Logging

### Backend Logs
```bash
# View logs in terminal where backend is running
# Or configure file logging in application.properties:
logging.file.name=logs/unihub.log
```

### Frontend Console
- Open browser DevTools (F12)
- Check Console tab for logs
- Check Network tab for API calls
- Check WS tab for WebSocket frames

### Database Logs
```bash
# PostgreSQL logs location (varies by OS)
# macOS: /usr/local/var/log/postgres.log
# Linux: /var/log/postgresql/postgresql-XX-main.log
```

---

## Backup & Recovery

### Database Backup
```bash
# Create backup
pg_dump -U postgres unihub_db > unihub_backup.sql

# Restore backup
psql -U postgres unihub_db < unihub_backup.sql
```

### Code Backup
```bash
# Commit to Git
git add .
git commit -m "Checkpoint: working version"
git push origin main
```

---

## Next Steps After Setup

1. **Create sample data:**
   - Register users with different roles
   - Create events and blogs
   - Test approval workflows

2. **Test gamification:**
   - Earn 100 points to unlock Explorer badge
   - Verify badge pop-up appears
   - Check leaderboard updates

3. **Explore admin features:**
   - Register admin user
   - View analytics dashboard
   - Manage universities

4. **Test WebSocket:**
   - Open browser console
   - Earn points and watch for WebSocket messages
   - Verify real-time updates

5. **Review documentation:**
   - `BACKEND_README.md` - Backend architecture
   - `FRONTEND_README.md` - Frontend architecture
   - `API_TESTING_GUIDE.md` - API testing examples

---

## Getting Help

### Documentation Files

| File | Purpose |
|------|---------|
| `BACKEND_README.md` | Backend technical docs |
| `FRONTEND_README.md` | Frontend technical docs |
| `SETUP.md` | Backend-specific setup |
| `API_TESTING_GUIDE.md` | API testing with cURL |
| `IMPLEMENTATION_SUMMARY.md` | Implementation overview |
| `CHANGES.md` | All changes made |
| `FULL_PROJECT_SETUP.md` | This file |

### Common Commands Quick Reference

```bash
# Backend
./mvnw clean install          # Build
./mvnw spring-boot:run        # Run
./mvnw test                   # Test

# Frontend
npm install                   # Install dependencies
npm run dev                   # Development server
npm run build                 # Production build
npm run lint                  # Lint code

# Database
createdb unihub_db           # Create database
psql -U postgres -d unihub_db # Connect to database
\dt                          # List tables
\d users                     # Describe users table
```

---

## Success Criteria

After following this guide, you should have:

✅ PostgreSQL database `unihub_db` created
✅ Backend running on port 8080
✅ Frontend running on port 5173
✅ Able to register and login users
✅ Able to create events and blogs
✅ Able to earn points and unlock badges
✅ Badge pop-up modal appears on threshold
✅ Leaderboard displays rankings
✅ WebSocket real-time updates working
✅ All 20+ pages accessible
✅ Role-based access control functioning

---

## Project Status

- ✅ **Backend:** Complete (60+ Java files)
- ✅ **Frontend:** Complete (30+ React files)
- ✅ **Database:** Schema defined (11 tables)
- ✅ **Documentation:** Complete (6 guides)
- ✅ **Integration:** Backend ↔ Frontend ↔ Database
- ✅ **WebSocket:** Real-time updates implemented
- ✅ **Authentication:** JWT-based with roles
- ✅ **Gamification:** Points, badges, leaderboards

**Ready for development, testing, and deployment!** 🎉

---

## License

This project is part of university coursework.

---

## Support

For issues:
1. Check logs (backend console, frontend console)
2. Review error messages
3. Consult documentation files
4. Verify all prerequisites installed
5. Ensure correct ports and URLs configured

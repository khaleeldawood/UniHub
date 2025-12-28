# UniHub API Testing Guide

## Quick Start Testing

### Step 1: Register Users

#### Register a Student
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Student",
    "email": "alice@example.edu",
    "password": "password123",
    "role": "STUDENT",
    "universityId": 1
  }'
```

#### Register a Supervisor
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bob Supervisor",
    "email": "bob@example.edu",
    "password": "password123",
    "role": "SUPERVISOR",
    "universityId": 1
  }'
```

#### Register an Admin
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Charlie Admin",
    "email": "charlie@example.edu",
    "password": "password123",
    "role": "ADMIN",
    "universityId": 1
  }'
```

Save the JWT tokens from responses!

---

### Step 2: Test Event Flow

#### Create Event (as Student)
```bash
STUDENT_TOKEN="<paste_student_token_here>"

curl -X POST http://localhost:8080/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -d '{
    "title": "React Workshop 2025",
    "description": "Learn React from scratch",
    "location": "Computer Lab 201",
    "startDate": "2025-02-15T14:00:00",
    "endDate": "2025-02-15T17:00:00",
    "type": "Workshop"
  }'
```

#### View Pending Events (as Supervisor)
```bash
SUPERVISOR_TOKEN="<paste_supervisor_token_here>"

curl -X GET "http://localhost:8080/api/events?status=PENDING" \
  -H "Authorization: Bearer $SUPERVISOR_TOKEN"
```

#### Approve Event (as Supervisor)
```bash
curl -X PUT http://localhost:8080/api/events/1/approve \
  -H "Authorization: Bearer $SUPERVISOR_TOKEN"
```

#### Join Event (as Another Student)
First register another student, then:
```bash
STUDENT2_TOKEN="<paste_student2_token_here>"

curl -X POST http://localhost:8080/api/events/1/join \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $STUDENT2_TOKEN" \
  -d '{
    "role": "VOLUNTEER"
  }'
```

This awards 20 points! Check notifications.

---

### Step 3: Test Blog Flow

#### Create Blog (as Student)
```bash
curl -X POST http://localhost:8080/api/blogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -d '{
    "title": "Top 10 Programming Tips",
    "content": "Here are my top programming tips for students...",
    "category": "ARTICLE",
    "isGlobal": false
  }'
```

#### Approve Blog (as Supervisor)
```bash
curl -X PUT http://localhost:8080/api/blogs/1/approve \
  -H "Authorization: Bearer $SUPERVISOR_TOKEN"
```

This awards 30 points to student! Check for badge promotion.

---

### Step 4: Test Gamification

#### Check My Notifications
```bash
curl -X GET http://localhost:8080/api/notifications \
  -H "Authorization: Bearer $STUDENT_TOKEN"
```

#### Check Leaderboard (Global Members)
```bash
curl -X GET "http://localhost:8080/api/gamification/leaderboard?scope=GLOBAL&type=MEMBERS"
```

#### Check Leaderboard (University Members)
```bash
curl -X GET "http://localhost:8080/api/gamification/leaderboard?scope=UNIVERSITY&type=MEMBERS&universityId=1"
```

#### Check Leaderboard (Events)
```bash
curl -X GET "http://localhost:8080/api/gamification/leaderboard?scope=GLOBAL&type=EVENTS"
```

#### Check My Badges
```bash
curl -X GET http://localhost:8080/api/gamification/my-badges \
  -H "Authorization: Bearer $STUDENT_TOKEN"
```

#### Get All Badges
```bash
curl -X GET http://localhost:8080/api/gamification/badges
```

---

### Step 5: Test Points & Badge Auto-Promotion

#### Scenario: Earn 100 Points to Get Explorer Badge

1. **Create and approve blog** (30 points)
2. **Join event as ORGANIZER** (50 points) - Total: 80
3. **Join another event as VOLUNTEER** (20 points) - Total: 100
4. **Badge auto-promotion should trigger!**

Check notifications:
```bash
curl -X GET http://localhost:8080/api/notifications \
  -H "Authorization: Bearer $STUDENT_TOKEN"
```

You should see: "Congratulations! You've earned the Explorer badge!"

---

### Step 6: Test Reporting System

#### Report a Blog
```bash
curl -X POST http://localhost:8080/api/reports/blogs/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -d '{
    "reason": "Inappropriate content"
  }'
```

#### View Reports (as Supervisor)
```bash
curl -X GET "http://localhost:8080/api/reports/blogs?pending=true" \
  -H "Authorization: Bearer $SUPERVISOR_TOKEN"
```

#### Review Report
```bash
curl -X PUT http://localhost:8080/api/reports/blogs/1/review \
  -H "Authorization: Bearer $SUPERVISOR_TOKEN"
```

---

### Step 7: Test Admin Features

#### Get System Analytics
```bash
ADMIN_TOKEN="<paste_admin_token_here>"

curl -X GET http://localhost:8080/api/admin/analytics \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

Expected response:
```json
{
  "totalUsers": 3,
  "totalEvents": 2,
  "totalBlogs": 1,
  "totalUniversities": 1,
  "activeUsers": 2,
  "pendingApprovals": {
    "events": 0,
    "blogs": 0
  },
  "usersByRole": {
    "students": 2,
    "supervisors": 1,
    "admins": 1
  }
}
```

#### Create a New University
```bash
curl -X POST http://localhost:8080/api/admin/universities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "name": "Tech University",
    "description": "Leading technology university",
    "logoUrl": "https://example.com/tech-logo.png"
  }'
```

#### List All Users
```bash
curl -X GET http://localhost:8080/api/admin/users \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

---

## WebSocket Testing

### Using Browser Console

```javascript
// Include SockJS and STOMP libraries first
const socket = new SockJS('http://localhost:8080/ws');
const stompClient = Stomp.over(socket);

stompClient.connect({}, function(frame) {
    console.log('Connected to WebSocket');
    
    // Replace with actual userId
    const userId = 1;
    
    // Subscribe to badge promotions
    stompClient.subscribe('/topic/badge-promotion/' + userId, function(message) {
        const badgeData = JSON.parse(message.body);
        console.log('Badge Earned!', badgeData);
        // Show pop-up modal with badge info
        alert(`Congratulations! You've earned the ${badgeData.badgeName} badge!`);
    });
    
    // Subscribe to leaderboard updates
    stompClient.subscribe('/topic/leaderboard-update', function(message) {
        const data = JSON.parse(message.body);
        console.log('Leaderboard Updated', data);
        // Refresh leaderboard component
    });
    
    // Subscribe to dashboard updates
    stompClient.subscribe('/topic/dashboard-update/' + userId, function(message) {
        const data = JSON.parse(message.body);
        console.log('Dashboard Update', data);
        // Refresh dashboard
    });
});

// Disconnect
// stompClient.disconnect();
```

---

## Testing Badge Auto-Promotion Flow

### Test Case: Student Earns Explorer Badge (100 points)

**Initial State:**
- Student has 0 points
- Current badge: Newcomer (0 points threshold)

**Actions:**
1. Create blog → Pending (0 points yet)
2. Supervisor approves blog → **+30 points** (Total: 30)
   - No badge change (Explorer needs 100)
3. Create event → Pending
4. Supervisor approves event
5. Join event as ORGANIZER → **+50 points** (Total: 80)
   - No badge change yet
6. Join another approved event as VOLUNTEER → **+20 points** (Total: 100)
   - **Badge auto-promotion triggered!**
   - Current badge updated to Explorer
   - UserBadge record created
   - Notification created: "Congratulations! You've earned the Explorer badge!"
   - WebSocket message sent to `/topic/badge-promotion/1`
   - Frontend shows pop-up modal

**Verify:**
```bash
# Check user's current badge
curl -X GET http://localhost:8080/api/users/me \
  -H "Authorization: Bearer $STUDENT_TOKEN"

# Check notifications
curl -X GET http://localhost:8080/api/notifications \
  -H "Authorization: Bearer $STUDENT_TOKEN"

# Check badge history
curl -X GET http://localhost:8080/api/gamification/my-badges \
  -H "Authorization: Bearer $STUDENT_TOKEN"
```

---

## Expected Points Distribution

| Action | Student Points | Supervisor Points |
|--------|----------------|-------------------|
| Blog Approved | +30 | +50 |
| Event Join (ORGANIZER) | +50 | - |
| Event Join (VOLUNTEER) | +20 | - |
| Event Join (ATTENDEE) | +10 | - |

---

## Common Test Scenarios

### Scenario 1: Multiple Badge Promotions

1. Student starts at 0 points (Newcomer badge)
2. Earns 150 points → Promotes to Explorer (100 threshold)
3. Earns 200 more points (total 350) → Promotes to Contributor (300 threshold)
4. Both promotions create separate notifications
5. Both are recorded in user_badges table

### Scenario 2: Global Blog Visibility

1. Student creates blog with `isGlobal: true`
2. Supervisor approves
3. Blog appears in:
   - Student's university feed
   - All other university feeds
   - Global blog list

### Scenario 3: Event Cancellation Notification

1. Multiple students join an approved event
2. Supervisor cancels event
3. All participants receive notification
4. Event status changes to CANCELLED

### Scenario 4: Leaderboard Rankings

1. Multiple students earn different points
2. Call leaderboard API
3. Users ranked by points descending
4. Can toggle between UNIVERSITY and GLOBAL scope
5. Can toggle between MEMBERS and EVENTS type

---

## Role-Based Access Testing

### Test Authorization

#### Student trying to approve event (should fail)
```bash
curl -X PUT http://localhost:8080/api/events/1/approve \
  -H "Authorization: Bearer $STUDENT_TOKEN"
```

Expected: 403 Forbidden

#### Supervisor approving event (should succeed)
```bash
curl -X PUT http://localhost:8080/api/events/1/approve \
  -H "Authorization: Bearer $SUPERVISOR_TOKEN"
```

Expected: 200 OK

#### Non-admin accessing admin endpoints (should fail)
```bash
curl -X GET http://localhost:8080/api/admin/analytics \
  -H "Authorization: Bearer $STUDENT_TOKEN"
```

Expected: 403 Forbidden

---

## Performance Testing

### Load Test Leaderboard

```bash
# Run multiple concurrent requests
for i in {1..100}; do
  curl -X GET "http://localhost:8080/api/gamification/leaderboard?scope=GLOBAL&type=MEMBERS" &
done
wait
```

### Test Database Connection Pool

Create multiple users concurrently and verify no connection pool exhaustion.

---

## Debugging Tips

### Enable SQL Logging

Already enabled in `application.properties`:
```properties
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

Watch console for SQL queries.

### Check Notifications Created

```bash
# Get all notifications for debugging
curl -X GET http://localhost:8080/api/notifications \
  -H "Authorization: Bearer $TOKEN"
```

### Verify Points Log

Create a new endpoint or query database directly:
```sql
SELECT * FROM points_log ORDER BY created_at DESC LIMIT 10;
```

### Check WebSocket Messages

Open browser console and monitor WebSocket frames in Network tab.

---

## Postman Collection

Import this JSON to Postman:

```json
{
  "info": {
    "name": "UniHub API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{jwt_token}}",
        "type": "string"
      }
    ]
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:8080/api"
    },
    {
      "key": "jwt_token",
      "value": ""
    }
  ]
}
```

Create requests for each endpoint listed in SETUP.md.

---

## Integration Test Checklist

- [ ] User registration with all roles
- [ ] User login and JWT token generation
- [ ] Create event proposal
- [ ] Approve event (supervisor)
- [ ] Join event and verify points awarded
- [ ] Verify badge auto-promotion at 100 points
- [ ] Create blog post
- [ ] Approve blog and verify points
- [ ] Check notifications created
- [ ] View leaderboard (both types and scopes)
- [ ] Report content
- [ ] Review reports as supervisor
- [ ] Admin analytics endpoint
- [ ] Create new university as admin
- [ ] WebSocket connection and badge notification
- [ ] Change password functionality
- [ ] Update user profile

---

## Expected Behavior Summary

### Points & Badges System

**Automatic Flow:**
1. User action → Points awarded
2. Points log created
3. User's total points updated
4. Badge eligibility checked
5. If new badge earned:
   - Current badge updated
   - User badge history created
   - Notification created
   - WebSocket message sent
6. Leaderboard WebSocket update sent
7. Dashboard WebSocket update sent (for specific user)

### Approval Workflow

**Events:**
- Create (PENDING) → Supervisor Approves → Status: APPROVED → Notification sent

**Blogs:**
- Create (PENDING) → Supervisor Approves → Status: APPROVED → Points awarded → Notification sent → Badge check

### Multi-University

**University-Specific:**
- Events belong to creator's university
- Blogs belong to author's university (unless global)

**Global Content:**
- Blogs with `isGlobal: true` appear across all universities
- Global leaderboard shows all universities combined
- University leaderboard shows only that university

---

## Success Criteria

After running through all tests, you should have:

✅ Multiple users registered with different roles
✅ Events created, approved, and joined
✅ Blogs created and approved with points awarded
✅ At least one user with 100+ points and Explorer badge
✅ Notifications showing badge promotions and approvals
✅ Leaderboard displaying ranked users
✅ WebSocket connections working
✅ Reports created and managed
✅ Admin analytics showing correct counts

---

## Common Issues & Solutions

### Issue: Event join fails with "Cannot join an event that is not approved"
**Solution:** Ensure event is approved by supervisor first

### Issue: Badge not auto-promoting
**Solution:** Check points threshold, verify badge exists in database, check logs for errors

### Issue: Notifications not appearing
**Solution:** Verify notification was created in database, check WebSocket connection

### Issue: Leaderboard empty
**Solution:** Ensure users have points > 0, check if correct scope/university selected

### Issue: JWT token expired
**Solution:** Login again to get new token (default expiration: 24 hours)

---

## Database Verification Queries

```sql
-- Check users and points
SELECT user_id, name, email, role, points FROM users ORDER BY points DESC;

-- Check badges earned
SELECT u.name, b.name as badge_name, ub.earned_at 
FROM user_badges ub
JOIN users u ON ub.user_id = u.user_id
JOIN badges b ON ub.badge_id = b.badge_id
ORDER BY ub.earned_at DESC;

-- Check points log
SELECT u.name, pl.source_type, pl.points, pl.description, pl.created_at
FROM points_log pl
JOIN users u ON pl.user_id = u.user_id
ORDER BY pl.created_at DESC
LIMIT 20;

-- Check notifications
SELECT u.name, n.message, n.type, n.is_read, n.created_at
FROM notifications n
JOIN users u ON n.user_id = u.user_id
ORDER BY n.created_at DESC
LIMIT 10;

-- Check event participants
SELECT e.title, u.name, ep.role, ep.points_awarded
FROM event_participants ep
JOIN events e ON ep.event_id = e.event_id
JOIN users u ON ep.user_id = u.user_id;
```

---

## Final Validation

Run this command to verify all components:
```bash
# Check if all tables were created
psql -U postgres -d unihub_db -c "\dt"
```

Expected tables:
- users
- user_badges
- universities
- events
- event_participants
- blogs
- points_log
- badges
- notifications
- blog_reports
- event_reports

All tests passing = Backend implementation complete! ✅

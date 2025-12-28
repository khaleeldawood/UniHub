# 🔧 Step-by-Step Troubleshooting Guide

## 🎯 Your Issues
1. Register page not working
2. Admin/Supervisor features not visible (looks like student)
3. Events/blogs not showing in dashboard

---

## 📍 STEP 1: Test Backend is Running

### Open a terminal and run:
```bash
cd /Users/ahmadraw/Downloads/unihub
./mvnw spring-boot:run
```

### Look for these success messages:
```
✅ "Started UnihubApplication"
✅ "Tomcat started on port(s): 8080"
✅ "HikariPool-1 - Start completed" (database connected)
```

### Test backend is accessible:
Open browser to: `http://localhost:8080/api/admin/universities`

**Expected**: JSON array of universities
**If you get 404/500**: Backend has issues

---

## 📍 STEP 2: Test Frontend is Running

### Open another terminal:
```bash
cd /Users/ahmadraw/Downloads/unihub/frontend
npm run dev
```

### Look for:
```
✅ "Local: http://localhost:5173/"
✅ "ready in XXX ms"
```

### Test frontend is accessible:
Open browser to: `http://localhost:5173`

---

## 📍 STEP 3: Diagnose Register Page Issue

### A. Open Register Page
1. Go to: `http://localhost:5173/register`
2. Open browser DevTools (F12)
3. Go to "Console" tab

### B. Look for These Errors:
```
❌ "Failed to load universities"
❌ Network error
❌ CORS error
❌ 401 Unauthorized
❌ 500 Server Error
```

### C. Check Network Tab:
1. Go to "Network" tab in DevTools
2. Refresh page
3. Look for request to: `GET /api/admin/universities`
4. Check status: Should be 200 OK
5. Check response: Should have university data

**If Request Fails**:
- Status 404: Backend not running or wrong endpoint
- Status 500: Backend error (check backend logs)
- Status 0 / CORS: CORS configuration issue
- No request made: Frontend code issue

---

## 📍 STEP 4: Diagnose Role Features Issue

### A. Login as Admin/Supervisor
1. Go to login page
2. Login with an ADMIN or SUPERVISOR account
3. Should redirect to dashboard

### B. Check localStorage Data:
Open browser console and run:
```javascript
// Check stored user data
const userData = localStorage.getItem('unihub_user');
console.log('Raw user data:', userData);

const user = JSON.parse(userData);
console.log('Parsed user:', user);
console.log('User role:', user.role);
console.log('Role type:', typeof user.role);
console.log('Role value:', JSON.stringify(user.role));
```

### C. Expected Results:
```javascript
// CORRECT FORMAT:
{
  "userId": 1,
  "name": "Admin User",
  "email": "admin@test.com",
  "role": "ADMIN",  // ← Should be string
  "points": 0,
  ...
}

// WRONG FORMAT (if you see this):
{
  "role": {"name": "ADMIN"}  // ← Object instead of string
}
```

### D. Check Navbar for Role Menu Items:
Run in console:
```javascript
// Force check role comparisons
const user = JSON.parse(localStorage.getItem('unihub_user'));
console.log('Is ADMIN?', user.role === 'ADMIN');
console.log('Is SUPERVISOR?', user.role === 'SUPERVISOR');
console.log('Is STUDENT?', user.role === 'STUDENT');
```

**If all return false**: Role comparison is broken

---

## 📍 STEP 5: Diagnose Dashboard Data Issue

### A. Open Dashboard with Console:
1. Login to your account
2. Go to: `http://localhost:5173/dashboard`
3. Keep Console open (F12)

### B. Check API Calls:
In Network tab, look for:
```
✅ GET /api/events/my-events
✅ GET /api/blogs/my-blogs
```

### C. Check Responses:
Click on each request and check:
- **Status**: Should be 200 OK
- **Response**: Should have JSON array of events/blogs
- **Response body**: `[{eventId: 1, title: "...", ...}, ...]`

**If Empty Array `[]`**:
- Either you haven't created events/blogs
- OR database has them but wrong user_id
- OR events/blogs exist but are in database only

### D. Verify Database Has Data:
Check your database directly:
```sql
-- Check events table
SELECT * FROM event WHERE creator_id = YOUR_USER_ID;

-- Check blogs table
SELECT * FROM blog WHERE author_id = YOUR_USER_ID;

-- If you see rows, data exists!
-- If empty, create some test data
```

---

## 📍 STEP 6: Test API Endpoints Manually

### Using Browser Console:
```javascript
// Test event API
fetch('http://localhost:8080/api/events/my-events', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('unihub_token'),
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('Status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Events data:', data);
  console.log('Count:', data.length);
})
.catch(error => console.error('Error:', error));

// Test blog API
fetch('http://localhost:8080/api/blogs/my-blogs', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('unihub_token'),
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('Status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Blogs data:', data);
  console.log('Count:', data.length);
})
.catch(error => console.error('Error:', error));
```

---

## 🔍 Common Issues & Quick Fixes

### Issue: "Registration fails with validation error"
**Fix**: Check all required fields are filled:
- Name (min 2 chars)
- Email (valid email format)
- University (must be selected)
- Password (min 6 chars)
- Confirm password (must match)

### Issue: "Can't see approval menus even as admin"
**Possible Causes**:
1. Role not stored correctly
2. Role stored as object instead of string
3. Cached old user data

**Fix**:
```javascript
// Clear and re-login
localStorage.clear();
// Then register/login again
```

### Issue: "Dashboard shows 0 events/blogs but DB has them"
**Possible Causes**:
1. Wrong user_id in database
2. API returning empty array
3. Frontend not displaying them

**Fix**:
```sql
-- Check database user_id matches
SELECT user_id, email, role FROM users WHERE email = 'your@email.com';
-- Note the user_id

SELECT * FROM event WHERE creator_id = (that user_id);
SELECT * FROM blog WHERE author_id = (that user_id);
```

---

## 🚨 Emergency Reset Procedure

If nothing works, do a complete reset:

### 1. Stop Everything
```bash
# Stop backend (Ctrl+C in backend terminal)
# Stop frontend (Ctrl+C in frontend terminal)
```

### 2. Clear All Data
```bash
# Drop and recreate database
psql -U postgres
DROP DATABASE unihub_db;
CREATE DATABASE unihub_db;
\q
```

### 3. Clear Frontend Cache
```javascript
// In browser console
localStorage.clear();
sessionStorage.clear();
```

### 4. Restart Backend
```bash
cd /Users/ahmadraw/Downloads/unihub
./mvnw spring-boot:run
```

Wait for "Started UnihubApplication"

### 5. Restart Frontend
```bash
cd /Users/ahmadraw/Downloads/unihub/frontend
npm run dev
```

### 6. Test Fresh
1. Register new ADMIN account
2. Check role badge on dashboard
3. Create test event
4. Check it appears on dashboard
5. Go to /my-events
6. Should see the event there

---

## 📊 Diagnostic Command Summary

Run these in order and share results:

### 1. Check User Data:
```javascript
console.log(JSON.parse(localStorage.getItem('unihub_user')));
```

### 2. Check Role:
```javascript
const user = JSON.parse(localStorage.getItem('unihub_user'));
console.log('Role:', user.role, 'Type:', typeof user.role);
```

### 3. Test Events API:
```javascript
fetch('http://localhost:8080/api/events/my-events', {
  headers: {'Authorization': 'Bearer ' + localStorage.getItem('unihub_token')}
}).then(r => r.json()).then(console.log);
```

### 4. Test Blogs API:
```javascript
fetch('http://localhost:8080/api/blogs/my-blogs', {
  headers: {'Authorization': 'Bearer ' + localStorage.getItem('unihub_token')}
}).then(r => r.json()).then(console.log);
```

---

## 📞 What to Share for Help

If issues persist, share:
1. **Browser console errors** (screenshot or copy-paste)
2. **Network tab** - failed requests (red ones)
3. **localStorage user object** - from step above
4. **Backend logs** - any ERROR lines
5. **Database query results** - event and blog counts

---

**Status**: 📋 Diagnostic Guide Ready  
**Action**: Follow steps above and report findings  
**Goal**: Identify exact root cause of each issue

# Critical Issues Diagnostic & Fixes

## 🚨 Reported Issues

1. ❌ Register page not working
2. ❌ Admin/Supervisor role features not showing (look like students)
3. ❌ Events/blogs not showing in dashboards
4. ❌ Need to verify APIs frontend and backend

---

## 🔍 Diagnostic Steps

### Issue 1: Register Page Not Working

**Potential Causes**:
1. Frontend validation error
2. Backend API error
3. University data not loading
4. Network/CORS issue

**Check**:
- Open browser console (F12)
- Try to register
- Look for error messages
- Check Network tab for failed requests

### Issue 2: Role Features Not Showing

**Potential Causes**:
1. Role data not properly stored in localStorage
2. Role comparison not working (enum vs string)
3. User object structure mismatch
4. Conditional rendering broken

**Debug Code Needed**:
```javascript
// Add to Dashboard.jsx temporarily
console.log('Current user object:', user);
console.log('User role:', user?.role);
console.log('Role type:', typeof user?.role);
console.log('Is Admin?', user?.role === USER_ROLES.ADMIN);
console.log('Is Supervisor?', user?.role === USER_ROLES.SUPERVISOR);
```

### Issue 3: Events/Blogs Not in Dashboard

**Potential Causes**:
1. API calls failing
2. Empty response from backend
3. User ID mismatch
4. Data not being set in state

**Debug Code Needed**:
```javascript
// Add to Dashboard.jsx loadDashboardData()
console.log('Loading dashboard data...');
console.log('Events response:', events);
console.log('Blogs response:', blogs);
console.log('My events state:', myEvents);
console.log('My blogs state:', myBlogs);
```

---

## 🔧 Quick Fixes to Apply

### Fix #1: Add Debug Logging to Dashboard

This will help us see what's actually happening:

```javascript
// In Dashboard.jsx loadDashboardData method
const loadDashboardData = async () => {
  console.log('=== DASHBOARD LOADING DEBUG ===');
  console.log('Current user:', user);
  console.log('User role:', user.role);
  console.log('User role type:', typeof user.role);
  
  try {
    // Load user's events
    console.log('Fetching my events...');
    const events = await eventService.getMyEvents();
    console.log('Events received:', events);
    console.log('Events is array?', Array.isArray(events));
    setMyEvents(Array.isArray(events) ? events.slice(0, 5) : []);

    // Load user's blogs
    console.log('Fetching my blogs...');
    const blogs = await blogService.getMyBlogs();
    console.log('Blogs received:', blogs);
    console.log('Blogs is array?', Array.isArray(blogs));
    setMyBlogs(Array.isArray(blogs) ? blogs.slice(0, 5) : []);
    
    console.log('=== END DEBUG ===');
  } catch (error) {
    console.error('Dashboard data load error:', error);
    console.error('Error details:', error.response);
  }
};
```

### Fix #2: Verify Role Comparison

The issue might be that the backend returns role as an object instead of string.

**Check localStorage**:
1. Open browser console
2. Type: `localStorage.getItem('unihub_user')`
3. See what the role field looks like

**Expected**: `"role": "ADMIN"`
**If you see**: `"role": {"name": "ADMIN"}` or similar, we need to fix it

### Fix #3: Add Fallback API Calls

Make sure the API calls have proper error handling and fallbacks.

---

## 🔄 Verification Script

Run this in browser console after logging in:

```javascript
// Check user data
const user = JSON.parse(localStorage.getItem('unihub_user'));
console.log('User data:', user);
console.log('Role:', user.role);
console.log('Role type:', typeof user.role);

// Test API calls
fetch('http://localhost:8080/api/events/my-events', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('unihub_token')
  }
})
.then(r => r.json())
.then(data => console.log('My events API response:', data))
.catch(err => console.error('My events API error:', err));

fetch('http://localhost:8080/api/blogs/my-blogs', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('unihub_token')
  }
})
.then(r => r.json())
.then(data => console.log('My blogs API response:', data))
.catch(err => console.error('My blogs API error:', err));
```

---

## 🎯 Immediate Actions Required

### Step 1: Check if Backend is Running
```bash
# Should see Spring Boot startup logs
# Should say "Started UnihubApplication"
# Should listen on port 8080
```

### Step 2: Check Database Connection
```bash
# In backend logs, look for:
# "HikariPool-1 - Start completed"
# "Initialized JPA EntityManagerFactory"
```

### Step 3: Check Frontend Connection
1. Open browser to `http://localhost:5173`
2. Open DevTools (F12)
3. Go to Network tab
4. Try to load dashboard
5. Check if API calls are being made
6. Check response status codes

### Step 4: Clear Cache and Re-test
```javascript
// Run in browser console
localStorage.clear();
sessionStorage.clear();
location.reload();
```

Then:
1. Register new user
2. Check if registration works
3. Login
4. Check dashboard
5. Check role features

---

## 🐛 Known Issues & Solutions

### Issue: "Cannot read property 'role' of undefined"
**Cause**: User object not loaded
**Solution**: Add null checks:
```javascript
{user && user.role === USER_ROLES.ADMIN && (
  // admin content
)}
```

### Issue: "Role features showing for everyone"
**Cause**: Role comparison broken
**Solution**: Check if role is string or object

### Issue: "Dashboard empty even with data in DB"
**Cause**: API call failing silently
**Solution**: Add better error logging and handling

---

## 📋 Quick Diagnostic Checklist

Run through this checklist:

- [ ] Backend running on port 8080?
- [ ] Database connected and populated?
- [ ] Frontend running on port 5173?
- [ ] Can you reach http://localhost:8080/api/events?
- [ ] Can you login successfully?
- [ ] Check browser console for errors?
- [ ] Check Network tab for failed API calls?
- [ ] Check localStorage has user data?
- [ ] User object has 'role' field?
- [ ] Role field is string "ADMIN"/"SUPERVISOR"/"STUDENT"?

---

## 🔧 Files to Check

### Backend:
1. AuthService.java - buildAuthResponse() method
2. EventController.java - getAllEvents(), getMyEvents()
3. BlogController.java - getAllBlogs(), getMyBlogs()
4. SecurityConfig.java - Permission configuration

### Frontend:
1. authService.js - register(), login() methods
2. AuthContext.jsx - User state management
3. Dashboard.jsx - loadDashboardData() method
4. Navbar.jsx - Role conditional rendering
5. api.js - Base API configuration

---

## 🚀 Manual Testing Steps

### Test Registration:
```
1. Open http://localhost:5173/register
2. Fill form completely:
   - Name: Test Admin
   - Email: admin@test.com
   - University: (select one)
   - Role: SUPERVISOR or ADMIN
   - Password: test123
   - Confirm: test123
3. Click Register
4. Check browser console for errors
5. Check Network tab for POST /api/auth/register
6. Should redirect to /dashboard
7. Check dashboard shows role badge
```

### Test Role Features:
```
1. Login as ADMIN/SUPERVISOR
2. Check navbar dropdown:
   - Should see "Event Approvals"
   - Should see "Blog Approvals"
   - Should see "Reports"
   - (Admin) Should see admin menu items
3. Check dashboard:
   - Should see role badge (red or yellow)
   - Should see "Supervisor/Admin Dashboard" header
   - Should see gold approval cards
4. If not seeing these, role comparison is broken
```

### Test Dashboard Data:
```
1. Login as any user
2. Go to /dashboard
3. Open browser console
4. Look for API calls to:
   - /api/events/my-events
   - /api/blogs/my-blogs
5. Check if they return 200 OK
6. Check response data
7. If empty arrays, check database
8. If 401/403, check auth token
```

---

## 💡 Most Likely Issues

Based on symptoms, here are the most probable causes:

### Register Page Not Working:
**Most Likely**: Frontend trying to load universities but failing
**Check**: adminService.getAllUniversities() call in Register.jsx

### Role Features Not Showing:
**Most Likely**: Role comparison issue - enum being compared as string
**Check**: Console log the user.role value and type

### Dashboard Empty:
**Most Likely**: API calls succeeding but returning empty arrays
**Check**: Database actually has records for this user_id

---

## 🎯 Next Steps

1. **Run Backend**: Make sure it's running and connected to DB
2. **Clear Frontend Cache**: localStorage.clear()
3. **Test with Console Open**: See actual errors
4. **Check Database**: Verify data exists with correct user_id
5. **Test API Directly**: Use Postman or curl to test endpoints
6. **Report Errors**: Share console errors and network responses

---

**Status**: ⚠️ Awaiting Diagnostic Results  
**Priority**: 🔴 Critical - Core functionality affected  
**Action**: Run diagnostic steps and report findings

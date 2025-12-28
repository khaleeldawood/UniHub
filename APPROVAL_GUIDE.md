# 📋 How to Approve Events and Blogs in UniHub

## 🔑 Access Requirements

To approve events and blogs, you need **SUPERVISOR** or **ADMIN** role.

### Check Your Role
1. Log into your account
2. Look at the top-right navbar dropdown (it shows your name and points)
3. Check if you see these menu items:
   - "Event Approvals"
   - "Blog Approvals"
   - "Reports"

If you **DON'T see these menu items**, you're logged in as a **STUDENT** and cannot approve content.

---

## 🎯 How to Access Approval Pages

### For SUPERVISOR or ADMIN users:

#### Method 1: Via Navbar (When Logged In)
1. Click on your name in the top-right navbar dropdown
2. Look for these menu items:
   - **Event Approvals** → Click to review pending events
   - **Blog Approvals** → Click to review pending blogs

#### Method 2: Direct URL
- Event Approvals: `http://localhost:5173/events/approvals`
- Blog Approvals: `http://localhost:5173/blogs/approvals`

#### Method 3: Via Dashboard
If you're a SUPERVISOR or ADMIN, your dashboard shows:
- **Pending Event Approvals** card with a "Review Events" button
- **Pending Blog Approvals** card with a "Review Blogs" button

---

## 📝 How to Approve/Reject

### Approving Events
1. Navigate to `/events/approvals`
2. You'll see a table with pending events showing:
   - Title
   - Creator name
   - Start date
   - Action buttons
3. Click the green **"Approve"** button to approve
4. Click the red **"Reject"** button to reject (you'll be asked for a reason)

### Approving Blogs
1. Navigate to `/blogs/approvals`
2. You'll see a table with pending blogs showing:
   - Title
   - Author name
   - Category
   - Action buttons
3. Click the green **"Approve"** button to approve
4. Click the red **"Reject"** button to reject (you'll be asked for a reason)

---

## 🚨 Common Issues & Solutions

### Issue 1: "I don't see the approval menu items"
**Cause**: You're logged in as a STUDENT
**Solution**: 
1. Log out
2. Register a new account with **SUPERVISOR** role
3. OR ask an admin to change your role to SUPERVISOR

### Issue 2: "I get 403 Forbidden error"
**Cause**: Your account doesn't have the required permissions
**Solution**: Check that your role is SUPERVISOR or ADMIN in the database

### Issue 3: "The approval pages are empty"
**Cause**: No pending events/blogs
**Solution**: 
1. Log in as a STUDENT account
2. Create new events or blogs
3. They will appear as PENDING
4. Log back in as SUPERVISOR/ADMIN to approve them

---

## 🎭 Testing the Approval Workflow

### Step-by-Step Test:

#### 1. Create a SUPERVISOR/ADMIN Account
```
Navigate to: /register
Fill in:
- Name: Supervisor Test
- Email: supervisor@university.edu
- University: Select any
- Role: SUPERVISOR  ← Important!
- Password: test123 (or your choice)
Click: Register
```

#### 2. Create a STUDENT Account
```
Navigate to: /register (in incognito/different browser)
Fill in:
- Name: Student Test
- Email: student@university.edu
- University: Select same as supervisor
- Role: STUDENT
- Password: test123
Click: Register
```

#### 3. Create Pending Content (as STUDENT)
```
Log in as: student@university.edu
Navigate to: /events/new
Create a test event
Navigate to: /blogs/new
Create a test blog
Both will be PENDING status
```

#### 4. Approve Content (as SUPERVISOR)
```
Log in as: supervisor@university.edu
Navigate to: /events/approvals (or click from navbar dropdown)
You should see the pending event
Click: Approve button
Navigate to: /blogs/approvals
You should see the pending blog
Click: Approve button
```

#### 5. Verify Approval
```
Navigate to: /events
The approved event should now be visible
Navigate to: /blogs
The approved blog should now be visible
```

---

## 🔧 Backend Configuration

The approval endpoints are configured in `SecurityConfig.java`:

```java
// Supervisor and Admin can approve/reject
.requestMatchers("/api/events/*/approve", "/api/events/*/reject").hasAnyRole("SUPERVISOR", "ADMIN")
.requestMatchers("/api/blogs/*/approve", "/api/blogs/*/reject").hasAnyRole("SUPERVISOR", "ADMIN")
```

---

## 📱 Mobile Access

On mobile devices:
1. Tap the hamburger menu (☰) in the navbar
2. Scroll down to find your user dropdown
3. Tap to expand and select "Event Approvals" or "Blog Approvals"

---

## 🎯 Quick Reference

| Page | URL | Role Required | Purpose |
|------|-----|---------------|---------|
| Event Approvals | `/events/approvals` | SUPERVISOR/ADMIN | Review and approve pending events |
| Blog Approvals | `/blogs/approvals` | SUPERVISOR/ADMIN | Review and approve pending blogs |
| Dashboard | `/dashboard` | Any authenticated | View approval counts (if supervisor/admin) |

---

## 💡 Pro Tips

1. **Dashboard Shortcut**: If you're a supervisor/admin, your dashboard shows pending approval counts with quick access buttons
2. **Bulk Approval**: Currently, you need to approve one by one. Consider requesting bulk approval feature
3. **Notification**: Approved/rejected items trigger notifications to the creators
4. **Points Award**: Approving events/blogs awards points to creators
5. **Rejection Reason**: Always provide clear rejection reasons to help creators improve

---

## 📞 Need Help?

If you still can't access the approval pages:

1. **Verify your role**:
   - Check the navbar dropdown title shows your role
   - Ask an admin to verify your role in the database
   
2. **Check the browser console**:
   - Press F12 to open developer tools
   - Check for any error messages
   - Look for 403 Forbidden errors
   
3. **Verify backend is running**:
   - Backend should be running on `http://localhost:8080`
   - Check that the database is connected
   
4. **Clear cache and cookies**:
   - Sometimes old tokens cause issues
   - Log out and log back in

---

**Last Updated**: December 25, 2025  
**Application**: UniHub - University Community Portal  
**Feature**: Event and Blog Approval System

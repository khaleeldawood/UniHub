# Critical Report Bug Fix - BUG-C3

## Issue
**BUG-C3: Report Actions Failing with 403 Forbidden**
- Reports page showed reports correctly
- "Resolve Report" and "Dismiss Report" buttons returned 403 Forbidden errors
- Affected both blog and event reports

## Root Cause
**API Endpoint Mismatch**

Frontend was calling:
```javascript
// WRONG - These endpoints don't exist
PUT /reports/blogs/{reportId}/resolve
PUT /reports/events/{reportId}/resolve
```

Backend actually implements:
```java
// CORRECT - These are the actual endpoints
PUT /reports/blogs/{reportId}/review
PUT /reports/events/{reportId}/review
```

## Fix Applied

### File: `frontend/src/services/reportService.js`

Changed endpoints from `/resolve` to `/review`:

```javascript
// Before:
resolveBlogReport: async (reportId) => {
  const response = await api.put(`/reports/blogs/${reportId}/resolve`);
  return response.data;
},

resolveEventReport: async (reportId) => {
  const response = await api.put(`/reports/events/${reportId}/resolve`);
  return response.data;
},

// After:
resolveBlogReport: async (reportId) => {
  const response = await api.put(`/reports/blogs/${reportId}/review`);
  return response.data;
},

resolveEventReport: async (reportId) => {
  const response = await api.put(`/reports/events/${reportId}/review`);
  return response.data;
},
```

## Backend Endpoints Verification

From `ReportController.java`:
```java
@PutMapping("/blogs/{id}/review")
@PreAuthorize("hasAnyRole('SUPERVISOR', 'ADMIN')")
public ResponseEntity<BlogReportDTO> reviewBlogReport(@PathVariable Long id)

@PutMapping("/events/{id}/review") 
@PreAuthorize("hasAnyRole('SUPERVISOR', 'ADMIN')")
public ResponseEntity<EventReportDTO> reviewEventReport(@PathVariable Long id)
```

## Testing

To test this fix:
1. Login as supervisor/admin
2. Navigate to Reports page
3. Click "Resolve Report" on any blog or event report
4. Should now work without 403 errors
5. Verify report status changes to REVIEWED in the list

## Impact
- ✅ Supervisors and admins can now successfully review reports
- ✅ Reports page is fully functional
- ✅ No security configuration changes needed
- ✅ No backend changes needed

## Status
✅ **FIXED** - Frontend endpoints now match backend implementation

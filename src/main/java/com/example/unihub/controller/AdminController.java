package com.example.unihub.controller;

import com.example.unihub.enums.BlogStatus;
import com.example.unihub.enums.EventStatus;
import com.example.unihub.enums.UserRole;
import com.example.unihub.model.University;
import com.example.unihub.model.User;
import com.example.unihub.repository.BlogRepository;
import com.example.unihub.repository.EventRepository;
import com.example.unihub.repository.UserRepository;
import com.example.unihub.service.UniversityService;
import com.example.unihub.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final UniversityService universityService;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final BlogRepository blogRepository;

    /**
     * Get all users
     * GET /api/admin/users?universityId=1&role=STUDENT
     */
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers(
            @RequestParam(required = false) Long universityId,
            @RequestParam(required = false) UserRole role) {
        
        if (universityId != null) {
            return ResponseEntity.ok(userService.getUsersByUniversity(universityId));
        } else if (role != null) {
            return ResponseEntity.ok(userRepository.findByRole(role));
        }
        
        return ResponseEntity.ok(userService.getAllUsers());
    }

    /**
     * Create a supervisor (Admin only)
     * POST /api/admin/users
     */
    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String email = request.get("email");
        String password = request.get("password");
        String roleValue = request.getOrDefault("role", "SUPERVISOR");
        Long universityId = request.get("universityId") != null ? Long.parseLong(request.get("universityId")) : null;

        if (name == null || name.isBlank() || email == null || email.isBlank() || password == null || password.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        UserRole role = UserRole.valueOf(roleValue);
        if (role != UserRole.SUPERVISOR && role != UserRole.ADMIN) {
            role = UserRole.SUPERVISOR;
        }

        User user = userService.createUser(name, email, password, role, universityId);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    /**
     * Get user details by ID
     * GET /api/admin/users/{id}
     */
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    /**
     * Update user (Admin only)
     * PUT /api/admin/users/{id}
     */
    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {
        
        User user = userService.getUserById(id);
        
        if (updates.containsKey("name")) {
            user.setName((String) updates.get("name"));
        }
        if (updates.containsKey("email")) {
            user.setEmail((String) updates.get("email"));
        }
        if (updates.containsKey("role")) {
            String roleStr = (String) updates.get("role");
            user.setRole(UserRole.valueOf(roleStr));
        }
        if (updates.containsKey("points")) {
            Integer points = Integer.parseInt(updates.get("points").toString());
            user.setPoints(points);
        }
        
        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(updatedUser);
    }

    /**
     * Deactivate user (Admin only)
     * DELETE /api/admin/users/{id}
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deactivateUser(@PathVariable Long id) {
        userService.deactivateUser(id);
        return ResponseEntity.ok("User deactivated");
    }

    /**
     * Get all universities
     * GET /api/admin/universities
     */
    @GetMapping("/universities")
    public ResponseEntity<List<University>> getAllUniversities() {
        List<University> universities = universityService.getAllUniversities();
        return ResponseEntity.ok(universities);
    }

    /**
     * Create a new university
     * POST /api/admin/universities
     */
    @PostMapping("/universities")
    public ResponseEntity<University> createUniversity(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String description = request.get("description");
        String logoUrl = request.get("logoUrl");
        
        University university = universityService.createUniversity(name, description, logoUrl);
        return ResponseEntity.status(HttpStatus.CREATED).body(university);
    }

    /**
     * Update university
     * PUT /api/admin/universities/{id}
     */
    @PutMapping("/universities/{id}")
    public ResponseEntity<University> updateUniversity(
            @PathVariable Long id,
            @RequestBody Map<String, String> updates) {
        
        String name = updates.get("name");
        String description = updates.get("description");
        String logoUrl = updates.get("logoUrl");
        
        University university = universityService.updateUniversity(id, name, description, logoUrl);
        return ResponseEntity.ok(university);
    }

    /**
     * Delete university
     * DELETE /api/admin/universities/{id}
     */
    @DeleteMapping("/universities/{id}")
    public ResponseEntity<String> deleteUniversity(@PathVariable Long id) {
        universityService.deleteUniversity(id);
        return ResponseEntity.ok("University deleted");
    }

    /**
     * Get system-wide analytics
     * GET /api/admin/analytics
     */
    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        
        // Total counts
        analytics.put("totalUsers", userRepository.count());
        analytics.put("totalEvents", eventRepository.count());
        analytics.put("totalBlogs", blogRepository.count());
        analytics.put("totalUniversities", universityService.getAllUniversities().size());
        
        // Active users (users with points > 0)
        analytics.put("activeUsers", userRepository.countActiveUsers());
        
        // Pending approvals
        Map<String, Long> pendingApprovals = new HashMap<>();
        pendingApprovals.put("events", eventRepository.countByStatus(EventStatus.PENDING));
        pendingApprovals.put("blogs", blogRepository.countByStatus(BlogStatus.PENDING));
        analytics.put("pendingApprovals", pendingApprovals);
        
        // Users by role
        Map<String, Long> usersByRole = new HashMap<>();
        usersByRole.put("students", userRepository.countByRole(UserRole.STUDENT));
        usersByRole.put("supervisors", userRepository.countByRole(UserRole.SUPERVISOR));
        usersByRole.put("admins", userRepository.countByRole(UserRole.ADMIN));
        analytics.put("usersByRole", usersByRole);
        
        return ResponseEntity.ok(analytics);
    }
}

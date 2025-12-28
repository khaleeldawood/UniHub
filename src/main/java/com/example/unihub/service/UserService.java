package com.example.unihub.service;

import com.example.unihub.enums.UserRole;
import com.example.unihub.exception.ResourceNotFoundException;
import com.example.unihub.model.Badge;
import com.example.unihub.model.University;
import com.example.unihub.model.User;
import com.example.unihub.model.UserBadge;
import com.example.unihub.repository.BadgeRepository;
import com.example.unihub.repository.UniversityRepository;
import com.example.unihub.repository.UserBadgeRepository;
import com.example.unihub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final UserBadgeRepository userBadgeRepository;
    private final BadgeRepository badgeRepository;
    private final UniversityRepository universityRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Get user by ID
     */
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
    }

    /**
     * Get user by email
     */
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    /**
     * Get all users
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Get users by university
     */
    public List<User> getUsersByUniversity(Long universityId) {
        return userRepository.findByUniversityUniversityId(universityId);
    }

    /**
     * Create a new user (Admin only)
     */
    @Transactional
    public User createUser(String name, String email, String password, UserRole role, Long universityId) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already registered");
        }
        
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setRole(role != null ? role : UserRole.STUDENT);
        user.setPoints(0);
        
        if (universityId != null) {
            University university = universityRepository.findById(universityId)
                .orElseThrow(() -> new IllegalArgumentException("University not found"));
            user.setUniversity(university);
        }
        
        Badge defaultBadge = badgeRepository.findTopByPointsThresholdLessThanEqualOrderByPointsThresholdDesc(0)
            .orElse(null);
        user.setCurrentBadge(defaultBadge);
        
        return userRepository.save(user);
    }

    /**
     * Update user profile
     */
    @Transactional
    public User updateUser(Long userId, String name, String email) {
        User user = getUserById(userId);
        
        if (name != null && !name.isBlank()) {
            user.setName(name);
        }
        
        if (email != null && !email.isBlank() && !email.equals(user.getEmail())) {
            // Check if new email already exists
            if (userRepository.existsByEmail(email)) {
                throw new IllegalArgumentException("Email already in use");
            }
            user.setEmail(email);
        }
        
        return userRepository.save(user);
    }

    /**
     * Change user password
     */
    @Transactional
    public void changePassword(Long userId, String oldPassword, String newPassword) {
        User user = getUserById(userId);
        
        // Verify old password
        if (!passwordEncoder.matches(oldPassword, user.getPasswordHash())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        
        // Set new password
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        log.info("Password changed for user {}", userId);
    }

    /**
     * Get all badges earned by user (historical)
     */
    public List<UserBadge> getUserBadges(Long userId) {
        return userBadgeRepository.findByUserUserIdOrderByEarnedAtDesc(userId);
    }

    /**
     * Get all available badges with user's progress
     */
    public List<Badge> getAllBadgesWithProgress(Long userId) {
        User user = getUserById(userId);
        List<Badge> allBadges = badgeRepository.findAllByOrderByPointsThresholdAsc();
        
        // The frontend can determine if each badge is earned by comparing
        // user's points with badge threshold
        return allBadges;
    }

    /**
     * Deactivate/Delete a user (Admin only)
     */
    @Transactional
    public void deactivateUser(Long userId) {
        User user = getUserById(userId);
        log.info("Deleting user {} ({})", userId, user.getEmail());
        
        // Delete user - cascading will handle related entities
        userRepository.delete(user);
        
        log.info("User {} successfully deleted", userId);
    }
}

package com.example.unihub.repository;

import com.example.unihub.model.UserBadge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserBadgeRepository extends JpaRepository<UserBadge, Long> {
    
    // Get all badges earned by a user
    List<UserBadge> findByUserUserIdOrderByEarnedAtDesc(Long userId);
    
    // Get users who earned a specific badge
    List<UserBadge> findByBadgeBadgeId(Long badgeId);
    
    // Check if user has earned a specific badge
    boolean existsByUserUserIdAndBadgeBadgeId(Long userId, Long badgeId);
    
    // Count badges earned by user
    long countByUserUserId(Long userId);
}

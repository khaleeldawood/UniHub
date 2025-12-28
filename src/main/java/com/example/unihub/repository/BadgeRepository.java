package com.example.unihub.repository;

import com.example.unihub.model.Badge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BadgeRepository extends JpaRepository<Badge, Long> {
    
    // Find badge by name
    Optional<Badge> findByName(String name);
    
    // Get all badges ordered by threshold
    List<Badge> findAllByOrderByPointsThresholdAsc();
    
    // Find highest badge user qualifies for
    Optional<Badge> findTopByPointsThresholdLessThanEqualOrderByPointsThresholdDesc(Integer points);
    
    // Get badges within point range
    List<Badge> findByPointsThresholdBetween(Integer min, Integer max);
}

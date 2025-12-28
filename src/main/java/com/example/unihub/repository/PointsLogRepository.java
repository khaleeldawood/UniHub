package com.example.unihub.repository;

import com.example.unihub.model.PointsLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PointsLogRepository extends JpaRepository<PointsLog, Long> {
    
    // Get all points logs for a user
    List<PointsLog> findByUserUserIdOrderByCreatedAtDesc(Long userId);
    
    // Filter by source type
    List<PointsLog> findByUserUserIdAndSourceType(Long userId, String sourceType);
    
    // Get points for specific source
    List<PointsLog> findBySourceTypeAndSourceId(String sourceType, Long sourceId);
    
    // Sum points for analytics
    @Query("SELECT SUM(p.points) FROM PointsLog p WHERE p.user.userId = :userId")
    Integer sumPointsByUserId(Long userId);
    
    @Query("SELECT SUM(p.points) FROM PointsLog p WHERE p.sourceType = :sourceType")
    Integer sumPointsBySourceType(String sourceType);
}

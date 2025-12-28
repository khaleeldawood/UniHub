package com.example.unihub.repository;

import com.example.unihub.model.Event;
import com.example.unihub.enums.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    // Filter by university and status (newest first)
    List<Event> findByUniversityUniversityIdAndStatusOrderByCreatedAtDesc(Long universityId, EventStatus status);
    
    List<Event> findByUniversityUniversityIdOrderByCreatedAtDesc(Long universityId);
    
    List<Event> findByStatusOrderByCreatedAtDesc(EventStatus status);
    
    // Filter by creator (newest first)
    List<Event> findByCreatorUserIdOrderByCreatedAtDesc(Long creatorId);

    List<Event> findAllByOrderByCreatedAtDesc();
    
    // Events by date range
    List<Event> findByStartDateAfterAndStatus(LocalDateTime startDate, EventStatus status);
    
    List<Event> findByStartDateBetween(LocalDateTime start, LocalDateTime end);
    
    // Top events by participants count (for leaderboard)
    @Query("SELECT e FROM Event e LEFT JOIN e.participants p " +
           "WHERE e.status = 'APPROVED' " +
           "GROUP BY e.eventId ORDER BY COUNT(p) DESC")
    List<Event> findTopEventsByParticipantsCount();
    
    @Query("SELECT e FROM Event e LEFT JOIN e.participants p " +
           "WHERE e.status = 'APPROVED' AND e.university.universityId = :universityId " +
           "GROUP BY e.eventId ORDER BY COUNT(p) DESC")
    List<Event> findTopEventsByParticipantsCountForUniversity(@Param("universityId") Long universityId);
    
    // Count events
    long countByStatus(EventStatus status);
    
    long countByUniversityUniversityId(Long universityId);
}

package com.example.unihub.repository;

import com.example.unihub.model.EventParticipant;
import com.example.unihub.enums.ParticipantRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventParticipantRepository extends JpaRepository<EventParticipant, Long> {
    
    // Check if user already joined event
    boolean existsByEventEventIdAndUserUserId(Long eventId, Long userId);
    
    Optional<EventParticipant> findByEventEventIdAndUserUserId(Long eventId, Long userId);
    
    // Get all participants for an event
    List<EventParticipant> findByEventEventId(Long eventId);
    
    // Get all events a user participated in
    List<EventParticipant> findByUserUserId(Long userId);
    
    // Filter by role
    List<EventParticipant> findByEventEventIdAndRole(Long eventId, ParticipantRole role);
    
    // Count participants
    long countByEventEventId(Long eventId);
    
    long countByEventEventIdAndRole(Long eventId, ParticipantRole role);
}

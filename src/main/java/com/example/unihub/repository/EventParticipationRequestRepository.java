package com.example.unihub.repository;

import com.example.unihub.enums.RequestStatus;
import com.example.unihub.model.EventParticipationRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventParticipationRequestRepository extends JpaRepository<EventParticipationRequest, Long> {
    List<EventParticipationRequest> findByEventEventIdAndStatus(Long eventId, RequestStatus status);
    List<EventParticipationRequest> findByUserUserId(Long userId);
    Optional<EventParticipationRequest> findByEventEventIdAndUserUserIdAndStatus(Long eventId, Long userId, RequestStatus status);
    boolean existsByEventEventIdAndUserUserIdAndStatus(Long eventId, Long userId, RequestStatus status);
}

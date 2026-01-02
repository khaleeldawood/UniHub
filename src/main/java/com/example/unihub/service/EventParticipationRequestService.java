package com.example.unihub.service;

import com.example.unihub.dto.ParticipationRequestDTO;
import com.example.unihub.dto.ParticipationRequestResponseDTO;
import com.example.unihub.enums.RequestStatus;
import com.example.unihub.model.Event;
import com.example.unihub.model.EventParticipant;
import com.example.unihub.model.EventParticipationRequest;
import com.example.unihub.model.User;
import com.example.unihub.repository.EventParticipantRepository;
import com.example.unihub.repository.EventParticipationRequestRepository;
import com.example.unihub.repository.EventRepository;
import com.example.unihub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventParticipationRequestService {
    private final EventParticipationRequestRepository requestRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final EventParticipantRepository participantRepository;

    @Transactional
    public ParticipationRequestResponseDTO submitRequest(Long eventId, Long userId, ParticipationRequestDTO dto) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if already participating
        if (participantRepository.existsByEventEventIdAndUserUserId(eventId, userId)) {
            throw new RuntimeException("You are already participating in this event");
        }

        // Check if has pending request
        if (requestRepository.existsByEventEventIdAndUserUserIdAndStatus(eventId, userId, RequestStatus.PENDING)) {
            throw new RuntimeException("You already have a pending request for this event");
        }

        EventParticipationRequest request = new EventParticipationRequest();
        request.setEvent(event);
        request.setUser(user);
        request.setRequestedRole(dto.getRequestedRole());
        request.setStatus(RequestStatus.PENDING);

        request = requestRepository.save(request);
        return mapToDTO(request);
    }

    public List<ParticipationRequestResponseDTO> getEventRequests(Long eventId) {
        return requestRepository.findByEventEventIdAndStatus(eventId, RequestStatus.PENDING)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ParticipationRequestResponseDTO> getUserRequests(Long userId) {
        return requestRepository.findByUserUserId(userId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void approveRequest(Long requestId, Long approverId) {
        EventParticipationRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Request already processed");
        }

        User approver = userRepository.findById(approverId)
                .orElseThrow(() -> new RuntimeException("Approver not found"));

        Event event = request.getEvent();
        
        // Calculate points based on role
        int points = 0;
        switch (request.getRequestedRole()) {
            case ORGANIZER:
                points = event.getOrganizerPoints();
                break;
            case VOLUNTEER:
                points = event.getVolunteerPoints();
                break;
            case ATTENDEE:
                points = event.getAttendeePoints();
                break;
        }

        // Create participant
        EventParticipant participant = new EventParticipant();
        participant.setEvent(event);
        participant.setUser(request.getUser());
        participant.setRole(request.getRequestedRole());
        participant.setPointsAwarded(points);
        participantRepository.save(participant);

        // Update request
        request.setStatus(RequestStatus.APPROVED);
        request.setRespondedAt(LocalDateTime.now());
        request.setRespondedBy(approver);
        requestRepository.save(request);
    }

    @Transactional
    public void rejectRequest(Long requestId, Long rejecterId) {
        EventParticipationRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Request already processed");
        }

        User rejecter = userRepository.findById(rejecterId)
                .orElseThrow(() -> new RuntimeException("Rejecter not found"));

        request.setStatus(RequestStatus.REJECTED);
        request.setRespondedAt(LocalDateTime.now());
        request.setRespondedBy(rejecter);
        requestRepository.save(request);
    }

    private ParticipationRequestResponseDTO mapToDTO(EventParticipationRequest request) {
        ParticipationRequestResponseDTO dto = new ParticipationRequestResponseDTO();
        dto.setRequestId(request.getRequestId());
        dto.setEventId(request.getEvent().getEventId());
        dto.setEventTitle(request.getEvent().getTitle());
        dto.setUserId(request.getUser().getUserId());
        dto.setUserName(request.getUser().getName());
        dto.setUserEmail(request.getUser().getEmail());
        dto.setRequestedRole(request.getRequestedRole());
        dto.setStatus(request.getStatus());
        dto.setRequestedAt(request.getRequestedAt());
        dto.setRespondedAt(request.getRespondedAt());
        if (request.getRespondedBy() != null) {
            dto.setRespondedByName(request.getRespondedBy().getName());
        }
        return dto;
    }
}

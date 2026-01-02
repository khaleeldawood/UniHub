package com.example.unihub.dto;

import com.example.unihub.enums.ParticipantRole;
import com.example.unihub.enums.RequestStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ParticipationRequestResponseDTO {
    private Long requestId;
    private Long eventId;
    private String eventTitle;
    private Long userId;
    private String userName;
    private String userEmail;
    private ParticipantRole requestedRole;
    private RequestStatus status;
    private LocalDateTime requestedAt;
    private LocalDateTime respondedAt;
    private String respondedByName;
}

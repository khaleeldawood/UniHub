package com.example.unihub.dto.request;

import com.example.unihub.enums.ParticipantRole;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class JoinEventRequest {
    
    @NotNull(message = "Role is required")
    private ParticipantRole role; // ORGANIZER, VOLUNTEER, ATTENDEE
}

package com.example.unihub.dto;

import com.example.unihub.enums.ParticipantRole;
import lombok.Data;

@Data
public class ParticipationRequestDTO {
    private ParticipantRole requestedRole;
}

package com.example.unihub.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "points_log")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PointsLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "points_log_id")
    private Long pointsLogId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"createdEvents", "blogs", "eventParticipants", "earnedBadges", "pointsLogs", "notifications", "passwordHash", "university"})
    private User user;

    @Column(name = "source_type", nullable = false)
    private String sourceType; // EVENT, BLOG, OTHER

    @Column(name = "source_id")
    private Long sourceId;

    @Column(nullable = false)
    private Integer points;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

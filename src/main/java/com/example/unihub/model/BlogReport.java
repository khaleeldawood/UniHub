package com.example.unihub.model;

import com.example.unihub.enums.ReportStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "blog_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlogReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Long reportId;

    @ManyToOne
    @JoinColumn(name = "blog_id", nullable = false)
    @JsonIgnoreProperties({"reports", "university"})
    private Blog blog;

    @ManyToOne
    @JoinColumn(name = "reported_by", nullable = false)
    @JsonIgnoreProperties({"createdEvents", "blogs", "eventParticipants", "earnedBadges", "pointsLogs", "notifications", "passwordHash", "university"})
    private User reportedBy;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportStatus status = ReportStatus.PENDING;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

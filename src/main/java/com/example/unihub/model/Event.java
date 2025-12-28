package com.example.unihub.model;

import com.example.unihub.enums.EventStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private Long eventId;

    @ManyToOne
    @JoinColumn(name = "university_id")
    @JsonIgnoreProperties({"users", "events", "blogs"})
    private University university;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String location;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    private String type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventStatus status = EventStatus.PENDING;

    @Column(name = "max_organizers")
    private Integer maxOrganizers;

    @Column(name = "max_volunteers")
    private Integer maxVolunteers;

    @Column(name = "max_attendees")
    private Integer maxAttendees;

    @Column(name = "organizer_points")
    private Integer organizerPoints = 50;

    @Column(name = "volunteer_points")
    private Integer volunteerPoints = 20;

    @Column(name = "attendee_points")
    private Integer attendeePoints = 10;

    @ManyToOne
    @JoinColumn(name = "created_by")
    @JsonIgnoreProperties({"createdEvents", "blogs", "eventParticipants", "earnedBadges", "pointsLogs", "notifications", "passwordHash", "university"})
    private User creator;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<EventParticipant> participants;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<EventReport> reports;

    @Transient
    private Long reportCount;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

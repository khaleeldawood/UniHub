package com.example.unihub.repository;

import com.example.unihub.model.EventReport;
import com.example.unihub.enums.ReportStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventReportRepository extends JpaRepository<EventReport, Long> {
    
    // Get all reports for an event
    List<EventReport> findByEventEventId(Long eventId);
    
    // Filter by status
    List<EventReport> findByStatus(ReportStatus status);
    
    List<EventReport> findByStatusOrderByCreatedAtDesc(ReportStatus status);
    
    // Get reports by reporter
    List<EventReport> findByReportedByUserId(Long userId);
    
    // Count reports
    long countByStatus(ReportStatus status);
    
    long countByEventEventId(Long eventId);
    
    // Check if user already reported an event
    boolean existsByEventEventIdAndReportedByUserId(Long eventId, Long userId);
}

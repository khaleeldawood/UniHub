package com.example.unihub.repository;

import com.example.unihub.model.BlogReport;
import com.example.unihub.enums.ReportStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogReportRepository extends JpaRepository<BlogReport, Long> {
    
    // Get all reports for a blog
    List<BlogReport> findByBlogBlogId(Long blogId);
    
    // Filter by status
    List<BlogReport> findByStatus(ReportStatus status);
    
    List<BlogReport> findByStatusOrderByCreatedAtDesc(ReportStatus status);
    
    // Get reports by reporter
    List<BlogReport> findByReportedByUserId(Long userId);
    
    // Count reports
    long countByStatus(ReportStatus status);
    
    long countByBlogBlogId(Long blogId);
    
    // Check if user already reported a blog
    boolean existsByBlogBlogIdAndReportedByUserId(Long blogId, Long userId);
}

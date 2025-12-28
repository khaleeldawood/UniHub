package com.example.unihub.repository;

import com.example.unihub.model.Notification;
import com.example.unihub.enums.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    // Get all notifications for a user
    List<Notification> findByUserUserIdOrderByCreatedAtDesc(Long userId);
    
    // Filter by read status
    List<Notification> findByUserUserIdAndIsReadOrderByCreatedAtDesc(Long userId, Boolean isRead);
    
    // Filter by type
    List<Notification> findByUserUserIdAndTypeOrderByCreatedAtDesc(Long userId, NotificationType type);
    
    // Get unread count
    long countByUserUserIdAndIsReadFalse(Long userId);
    
    // Get all unread notifications
    List<Notification> findByUserUserIdAndIsReadFalseOrderByCreatedAtDesc(Long userId);
}

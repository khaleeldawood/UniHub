package com.example.unihub.repository;

import com.example.unihub.model.Blog;
import com.example.unihub.enums.BlogStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {
    
    // Filter by university and status
    List<Blog> findByUniversityUniversityIdAndStatus(Long universityId, BlogStatus status);
    
    List<Blog> findByUniversityUniversityId(Long universityId);
    
    List<Blog> findByStatus(BlogStatus status);
    
    // Filter by author
    List<Blog> findByAuthorUserId(Long authorId);
    
    // Filter by category
    List<Blog> findByCategory(String category);
    
    List<Blog> findByCategoryAndStatus(String category, BlogStatus status);
    
    // Global blogs
    List<Blog> findByIsGlobalTrueAndStatus(BlogStatus status);
    
    // Combined: university + global blogs
    @Query("SELECT b FROM Blog b WHERE (b.university.universityId = :universityId OR b.isGlobal = true) AND b.status = :status")
    List<Blog> findByUniversityOrGlobalAndStatus(Long universityId, BlogStatus status);
    
    // Count blogs
    long countByStatus(BlogStatus status);
    
    long countByUniversityUniversityId(Long universityId);
    
    long countByAuthorUserId(Long authorId);
}

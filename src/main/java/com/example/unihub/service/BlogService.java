package com.example.unihub.service;

import com.example.unihub.dto.request.CreateBlogRequest;
import com.example.unihub.enums.BlogStatus;
import com.example.unihub.enums.NotificationType;
import com.example.unihub.enums.UserRole;
import com.example.unihub.exception.ResourceNotFoundException;
import com.example.unihub.model.Blog;
import com.example.unihub.model.Notification;
import com.example.unihub.model.User;
import com.example.unihub.repository.BlogReportRepository;
import com.example.unihub.repository.BlogRepository;
import com.example.unihub.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BlogService {

    private final BlogRepository blogRepository;
    private final BlogReportRepository blogReportRepository;
    private final NotificationRepository notificationRepository;
    private final GamificationService gamificationService;

    /**
     * Create a new blog post
     */
    @Transactional
    public Blog createBlog(CreateBlogRequest request, User author) {
        log.info("Creating new blog: {} by user {}", request.getTitle(), author.getUserId());
        
        Blog blog = new Blog();
        blog.setTitle(request.getTitle());
        blog.setContent(request.getContent());
        blog.setCategory(request.getCategory());
        blog.setIsGlobal(request.getIsGlobal());
        blog.setStatus(BlogStatus.PENDING);
        blog.setAuthor(author);
        
        // Set university (null if global)
        if (!request.getIsGlobal() && author.getUniversity() != null) {
            blog.setUniversity(author.getUniversity());
        }
        
        return blogRepository.save(blog);
    }

    /**
     * Update an existing blog (Author can edit PENDING or APPROVED blogs)
     */
    @Transactional
    public Blog updateBlog(Long blogId, CreateBlogRequest request, User currentUser) {
        log.info("Updating blog {} by user {}", blogId, currentUser.getUserId());
        
        Blog blog = getBlogById(blogId);
        
        // Check if user is the author
        if (!blog.getAuthor().getUserId().equals(currentUser.getUserId())) {
            throw new IllegalStateException("You do not have permission to edit this blog");
        }
        
        // Allow editing PENDING or APPROVED blogs (APPROVED will reset to PENDING)
        if (blog.getStatus() != BlogStatus.PENDING && blog.getStatus() != BlogStatus.APPROVED) {
            throw new IllegalStateException("Only pending or approved blogs can be edited");
        }
        
        // If blog was APPROVED, reset to PENDING (requires re-approval after edit)
        boolean wasApproved = blog.getStatus() == BlogStatus.APPROVED;
        if (wasApproved) {
            blog.setStatus(BlogStatus.PENDING);
            log.info("Blog {} status reset to PENDING due to edit (was APPROVED)", blogId);
        }
        
        // Update blog fields
        blog.setTitle(request.getTitle());
        blog.setContent(request.getContent());
        blog.setCategory(request.getCategory());
        blog.setIsGlobal(request.getIsGlobal());
        
        // Update university (null if global)
        if (!request.getIsGlobal() && currentUser.getUniversity() != null) {
            blog.setUniversity(currentUser.getUniversity());
        } else if (request.getIsGlobal()) {
            blog.setUniversity(null);
        }
        
        Blog updatedBlog = blogRepository.save(blog);
        
        // Notify author if blog was reset to pending
        if (wasApproved) {
            Notification notification = new Notification();
            notification.setUser(currentUser);
            notification.setMessage("Your blog '" + blog.getTitle() + "' has been updated and requires re-approval");
            notification.setType(NotificationType.BLOG_APPROVAL);
            notification.setLinkUrl("/blogs/" + blogId);
            notification.setIsRead(false);
            notificationRepository.save(notification);
        }
        
        log.info("Blog {} updated successfully", blogId);
        
        return updatedBlog;
    }

    /**
     * Get all blogs with optional filters
     */
    public List<Blog> getAllBlogs(Long universityId, String category, BlogStatus status, Boolean isGlobal) {
        List<Blog> blogs;
        if (universityId != null && status != null) {
            // Return university blogs + global blogs if status is APPROVED
            if (status == BlogStatus.APPROVED) {
                blogs = blogRepository.findByUniversityOrGlobalAndStatus(universityId, status);
            } else {
                blogs = blogRepository.findByUniversityUniversityIdAndStatus(universityId, status);
            }
        } else if (universityId != null) {
            blogs = blogRepository.findByUniversityUniversityId(universityId);
        } else if (category != null && status != null) {
            blogs = blogRepository.findByCategoryAndStatus(category, status);
        } else if (category != null) {
            blogs = blogRepository.findByCategory(category);
        } else if (status != null) {
            blogs = blogRepository.findByStatus(status);
        } else if (isGlobal != null && isGlobal && status != null) {
            blogs = blogRepository.findByIsGlobalTrueAndStatus(status);
        } else {
            blogs = blogRepository.findAll();
        }

        applyReportCounts(blogs);
        return sortByCreatedAtDesc(blogs);
    }

    /**
     * Get blog by ID
     */
    public Blog getBlogById(Long blogId) {
        Blog blog = blogRepository.findById(blogId)
            .orElseThrow(() -> new ResourceNotFoundException("Blog", "id", blogId));
        applyReportCount(blog);
        return blog;
    }

    /**
     * Approve a blog (Supervisor only)
     */
    @Transactional
    public void approveBlog(Long blogId) {
        log.info("Approving blog {}", blogId);
        
        Blog blog = getBlogById(blogId);
        
        if (blog.getStatus() == BlogStatus.APPROVED) {
            throw new IllegalStateException("Blog is already approved");
        }
        
        blog.setStatus(BlogStatus.APPROVED);
        blogRepository.save(blog);
        
        // Calculate points based on author role
        User author = blog.getAuthor();
        int points = author.getRole() == UserRole.STUDENT ? 30 : 50;
        
        // Award points through gamification service
        gamificationService.awardPoints(
            author,
            points,
            "BLOG",
            blogId,
            "Blog approved: " + blog.getTitle()
        );
        
        // Notify author
        Notification notification = new Notification();
        notification.setUser(author);
        notification.setMessage("Your blog '" + blog.getTitle() + "' has been approved!");
        notification.setType(NotificationType.BLOG_APPROVAL);
        notification.setLinkUrl("/blogs/" + blogId);
        notification.setIsRead(false);
        notificationRepository.save(notification);
        
        gamificationService.sendDashboardUpdate(author.getUserId());
        
        log.info("Blog {} approved successfully, {} points awarded to author", blogId, points);
    }

    /**
     * Reject a blog (Supervisor only)
     */
    @Transactional
    public void rejectBlog(Long blogId, String reason) {
        log.info("Rejecting blog {}", blogId);
        
        Blog blog = getBlogById(blogId);
        blog.setStatus(BlogStatus.REJECTED);
        blogRepository.save(blog);
        
        // Notify author
        Notification notification = new Notification();
        notification.setUser(blog.getAuthor());
        notification.setMessage("Your blog '" + blog.getTitle() + "' was rejected. Reason: " + reason);
        notification.setType(NotificationType.BLOG_APPROVAL);
        notification.setLinkUrl("/blogs/" + blogId);
        notification.setIsRead(false);
        notificationRepository.save(notification);
        
        gamificationService.sendDashboardUpdate(blog.getAuthor().getUserId());
        
        log.info("Blog {} rejected", blogId);
    }

    /**
     * Get blogs by author
     */
    public List<Blog> getBlogsByAuthor(Long authorId) {
        List<Blog> blogs = blogRepository.findByAuthorUserId(authorId);
        applyReportCounts(blogs);
        return sortByCreatedAtDesc(blogs);
    }

    /**
     * Get pending blogs for approval
     */
    public List<Blog> getPendingBlogs() {
        List<Blog> blogs = blogRepository.findByStatus(BlogStatus.PENDING);
        applyReportCounts(blogs);
        return sortByCreatedAtDesc(blogs);
    }

    /**
     * Delete a blog (Author can delete PENDING/REJECTED, Admin can delete any)
     */
    @Transactional
    public void deleteBlog(Long blogId, User currentUser) {
        log.info("Attempting to delete blog {} by user {}", blogId, currentUser.getUserId());
        
        Blog blog = getBlogById(blogId);
        
        // Check permissions
        boolean isAuthor = blog.getAuthor().getUserId().equals(currentUser.getUserId());
        boolean isAdmin = currentUser.getRole() == UserRole.ADMIN;
        
        if (!isAuthor && !isAdmin) {
            throw new IllegalStateException("You do not have permission to delete this blog");
        }
        
        // Authors can only delete PENDING or REJECTED blogs
        if (isAuthor && !isAdmin) {
            if (blog.getStatus() == BlogStatus.APPROVED) {
                throw new IllegalStateException("Cannot delete an approved blog. Contact an admin.");
            }
        }
        
        // Delete the blog
        blogRepository.delete(blog);
        log.info("Blog {} deleted successfully by user {}", blogId, currentUser.getUserId());
    }

    private List<Blog> sortByCreatedAtDesc(List<Blog> blogs) {
        if (blogs == null) {
            return List.of();
        }
        blogs.sort(Comparator.comparing(Blog::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed());
        return blogs;
    }

    private void applyReportCounts(List<Blog> blogs) {
        if (blogs == null) {
            return;
        }
        for (Blog blog : blogs) {
            applyReportCount(blog);
        }
    }

    private void applyReportCount(Blog blog) {
        if (blog == null || blog.getBlogId() == null) {
            return;
        }
        long count = blogReportRepository.countByBlogBlogId(blog.getBlogId());
        blog.setReportCount(count);
    }
}

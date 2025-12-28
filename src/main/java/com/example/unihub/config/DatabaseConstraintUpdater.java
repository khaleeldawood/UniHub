package com.example.unihub.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseConstraintUpdater implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        try {
            jdbcTemplate.execute("ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check");
            jdbcTemplate.execute(
                "ALTER TABLE notifications ADD CONSTRAINT notifications_type_check " +
                "CHECK (type IN ('LEVEL_UP', 'BADGE_EARNED', 'EVENT_UPDATE', 'BLOG_APPROVAL', 'SYSTEM_ALERT', 'POINTS_UPDATE'))"
            );
            log.info("notifications_type_check constraint updated successfully");
        } catch (Exception ex) {
            log.warn("Skipping notifications_type_check update: {}", ex.getMessage());
        }
    }
}

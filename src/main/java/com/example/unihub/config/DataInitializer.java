package com.example.unihub.config;

import com.example.unihub.model.Badge;
import com.example.unihub.model.University;
import com.example.unihub.repository.BadgeRepository;
import com.example.unihub.repository.UniversityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final BadgeRepository badgeRepository;
    private final UniversityRepository universityRepository;

    @Override
    public void run(String... args) {
        initializeBadges();
        initializeSampleUniversity();
    }

    private void initializeBadges() {
        if (badgeRepository.count() == 0) {
            log.info("Initializing gaming-inspired badges...");
            
            Badge newbie = new Badge();
            newbie.setName("Newbie");
            newbie.setDescription("🎮 Welcome to UniHub! Your journey begins.");
            newbie.setPointsThreshold(0);
            badgeRepository.save(newbie);
            
            Badge pupil = new Badge();
            pupil.setName("Pupil");
            pupil.setDescription("⚡ Earned 100 points! You're learning fast.");
            pupil.setPointsThreshold(100);
            badgeRepository.save(pupil);
            
            Badge specialist = new Badge();
            specialist.setName("Specialist");
            specialist.setDescription("🌟 Reached 300 points! You're becoming skilled.");
            specialist.setPointsThreshold(300);
            badgeRepository.save(specialist);
            
            Badge expert = new Badge();
            expert.setName("Expert");
            expert.setDescription("💎 600 points! You're an expert contributor.");
            expert.setPointsThreshold(600);
            badgeRepository.save(expert);
            
            Badge master = new Badge();
            master.setName("Master");
            master.setDescription("👑 1000 points! Master of the UniHub!");
            master.setPointsThreshold(1000);
            badgeRepository.save(master);
            
            Badge grandmaster = new Badge();
            grandmaster.setName("Grandmaster");
            grandmaster.setDescription("🏆 1500+ points! Grandmaster rank achieved!");
            grandmaster.setPointsThreshold(1500);
            badgeRepository.save(grandmaster);
            
            Badge legend = new Badge();
            legend.setName("Legendary");
            legend.setDescription("🎖️ 2500+ points! You've reached legendary status!");
            legend.setPointsThreshold(2500);
            badgeRepository.save(legend);
            
            log.info("Initialized {} gaming-inspired badges", badgeRepository.count());
        }
    }

    private void initializeSampleUniversity() {
        log.info("Ensuring Jordan universities are available...");
        
        ensureUniversity(
            "University of Jordan",
            "The largest and oldest university in Jordan, located in Amman",
            "https://ju.edu.jo/images/logo.png"
        );
        
        ensureUniversity(
            "Jordan University of Science and Technology",
            "A leading technological university in Irbid",
            "https://just.edu.jo/images/logo.png"
        );
        
        ensureUniversity(
            "Yarmouk University",
            "A major public university in Irbid",
            "https://yu.edu.jo/images/logo.png"
        );
        
        ensureUniversity(
            "Hashemite University",
            "A public university in Zarqa",
            "https://hu.edu.jo/images/logo.png"
        );
        
        ensureUniversity(
            "Mutah University",
            "Located in Karak, known for military sciences",
            "https://mutah.edu.jo/images/logo.png"
        );
        
        ensureUniversity(
            "Al al-Bayt University",
            "Public university in Mafraq",
            "https://aabu.edu.jo/images/logo.png"
        );
        
        ensureUniversity(
            "German Jordanian University",
            "A partnership between Germany and Jordan, located in Amman",
            "https://gju.edu.jo/images/logo.png"
        );
        
        ensureUniversity(
            "Princess Sumaya University for Technology",
            "Private university specialized in technology and IT",
            "https://psut.edu.jo/images/logo.png"
        );
        
        log.info("Jordan universities check completed");
    }

    private void ensureUniversity(String name, String description, String logoUrl) {
        if (universityRepository.existsByName(name)) {
            return;
        }
        
        University university = new University();
        university.setName(name);
        university.setDescription(description);
        university.setLogoUrl(logoUrl);
        universityRepository.save(university);
    }
}

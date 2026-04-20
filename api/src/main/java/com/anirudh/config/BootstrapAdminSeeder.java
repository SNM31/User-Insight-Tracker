package com.anirudh.config;

import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.anirudh.model.User;
import com.anirudh.repository.UserRepository;

@Component
@ConditionalOnProperty(prefix = "app.bootstrap.admin", name = "enabled", havingValue = "true")
public class BootstrapAdminSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(BootstrapAdminSeeder.class);
    private static final String ADMIN_ROLE = "ROLE_ADMIN";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.bootstrap.admin.email}")
    private String adminEmail;

    @Value("${app.bootstrap.admin.username:Local Admin}")
    private String adminUsername;

    public BootstrapAdminSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        String normalizedEmail = adminEmail == null ? "" : adminEmail.trim();
        String configuredUsername = adminUsername == null ? "" : adminUsername.trim();
        String normalizedUsername = configuredUsername.isEmpty() ? "Local Admin" : configuredUsername;

        if (normalizedEmail.isEmpty()) {
            logger.warn("Bootstrap admin seeder skipped because app.bootstrap.admin.email is empty.");
            return;
        }

        userRepository.findByEmail(normalizedEmail)
                .ifPresentOrElse(
                        user -> ensureAdminAccess(user, normalizedUsername),
                        () -> createAdminUser(normalizedEmail, normalizedUsername));
    }

    private void ensureAdminAccess(User user, String normalizedUsername) {
        boolean updated = false;

        if (!ADMIN_ROLE.equals(user.getRole())) {
            user.setRole(ADMIN_ROLE);
            updated = true;
        }

        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            user.setUsername(normalizedUsername);
            updated = true;
        }

        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            updated = true;
        }

        if (updated) {
            userRepository.save(user);
            logger.info("Bootstrap admin user ensured for {}", user.getEmail());
            return;
        }

        logger.info("Bootstrap admin user already available for {}", user.getEmail());
    }

    private void createAdminUser(String normalizedEmail, String normalizedUsername) {
        User user = User.builder()
                .email(normalizedEmail)
                .username(normalizedUsername)
                .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                .role(ADMIN_ROLE)
                .build();

        userRepository.save(user);
        logger.info("Bootstrap admin user created for {}", normalizedEmail);
    }
}

package com.ems.config;

import com.ems.entity.User;
import com.ems.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("Admin@123"))  // BCrypt hashed
                    .fullName("System Administrator")
                    .role(User.Role.ADMIN)
                    .enabled(true)
                    .build();
            userRepository.save(admin);
            log.info("✅ Default admin user created. Username: admin | Password: Admin@123");
            log.info("⚠️  Please change the default password immediately after first login.");
        }
    }
}

package org.canay.backend.utils;

import jakarta.transaction.Transactional;
import org.canay.backend.domain.entities.User;
import org.canay.backend.domain.entities.UserRole;
import org.canay.backend.repository.UserRepository;
import org.canay.backend.repository.UserRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class SetupDataLoader implements ApplicationListener<ContextRefreshedEvent> {

    @Value("${initial.admin.username}")
    private String adminUsername;

    @Value("${initial.admin.password}")
    private String adminPassword;

    @Value("${initial.admin.email}")
    private String adminEmail;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void onApplicationEvent(ContextRefreshedEvent event) {
        UserRole adminRole = userRoleRepository.findByName("ADMIN")
                .orElseThrow(() -> new RuntimeException("Error: Role not found in database"));

        if (userRepository.findByUsername(adminUsername).isEmpty()) {

            User admin = User.builder()
                    .username(adminUsername)
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .role(adminRole)
                    .isEnabled(true)
                    .build();

            userRepository.save(admin);
        }
    }
}
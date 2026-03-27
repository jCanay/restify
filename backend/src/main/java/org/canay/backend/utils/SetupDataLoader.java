package org.canay.backend.utils;

import jakarta.transaction.Transactional;
import org.canay.backend.domain.entities.AvailabilityRuleType;
import org.canay.backend.domain.entities.User;
import org.canay.backend.domain.entities.UserRole;
import org.canay.backend.repository.AvailabilityRuleTypeRepository;
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

    @Autowired
    private AvailabilityRuleTypeRepository ruleTypeRepository;

    @Override
    @Transactional
    public void onApplicationEvent(ContextRefreshedEvent event) {
        // 1. Inicializar Tipos de Reglas de Disponibilidad
        createRuleTypeIfNotFound("VACATION", 1, "Cierres por vacaciones o reformas.");
        createRuleTypeIfNotFound("SPECIFIC_DATE", 2, "Excepciones para días concretos (Festivos, eventos).");
        createRuleTypeIfNotFound("RECURRING", 3, "Horario base semanal (Lunes a Domingo).");

        UserRole adminRole = userRoleRepository.findByName("ROLE_ADMIN")
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

    private void createRuleTypeIfNotFound(String name, Integer priority, String description) {
        ruleTypeRepository.findByName(name).ifPresentOrElse(
                type -> {}, // Ya existe, no hacemos nada
                () -> {
                    AvailabilityRuleType newType = AvailabilityRuleType.builder()
                            .name(name)
                            .priority(priority)
                            .description(description)
                            .build();
                    ruleTypeRepository.save(newType);
                }
        );
    }
}
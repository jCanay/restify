package org.canay.backend.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.entities.*;
import org.canay.backend.repository.*;
import org.canay.backend.service.DashboardService;
import org.canay.backend.service.LocationService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class SetupDataLoader implements ApplicationListener<ContextRefreshedEvent> {
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final UserRoleRepository userRoleRepository;
    private final RestaurantRepository restaurantRepository;
    private final AvailabilityRuleTypeRepository ruleTypeRepository;
    private final DashboardRepository dashboardRepository;
    private final DashboardPageRepository dashboardPageRepository;
    private final WidgetRepository widgetRepository;
    private final AddressRepository addressRepository;

    private final DashboardService dashboardService;
    private final LocationService locationService;

    private final ObjectMapper objectMapper;
    private final PasswordEncoder passwordEncoder;

    @Value("${initial.admin.username}")
    private String adminUsername;

    @Value("${initial.admin.password}")
    private String adminPassword;

    @Value("${initial.admin.email}")
    private String adminEmail;

    @Override
    @Transactional
    public void onApplicationEvent(ContextRefreshedEvent event) {
        // 1. Inicializar Tipos de Reglas de Disponibilidad
        createRuleTypeIfNotFound("VACATION", 1, "Cierres por vacaciones o reformas.");
        createRuleTypeIfNotFound("SPECIFIC_DATE", 2, "Excepciones para días concretos (Festivos, eventos).");
        createRuleTypeIfNotFound("RECURRING", 3, "Horario base semanal (Lunes a Domingo).");

        UserRole adminRole = userRoleRepository.findByName("ROLE_ADMIN")
                .orElseThrow(() -> new RuntimeException("Error: Role not found in database"));

        // Admin user
        if (userRepository.findByUsername(adminUsername).isEmpty()) {
            User admin = User.builder()
                    .username(adminUsername)
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .role(adminRole)
                    .build();
            User savedAdmin = userRepository.save(admin);

            Account adminAccount = Account.builder()
                    .user(savedAdmin)
                    .onboardingCompleted(true)
                    .build();
            Account savedAdminAccount = accountRepository.save(adminAccount);

            Restaurant adminRestaurant = Restaurant.builder()
                    .name("admin")
                    .deliveryRadius(2500.0)
                    .account(savedAdminAccount)
                    .isDefault(true)
                    .build();

            Address adminRestaurantAddress = Address.builder()
                    .streetAddress("Calle Admin 1")
                    .city("Ourense")
                    .country("Spain")
                    .countryCode("es")
                    .zipCode("32002")
                    .latitude(42.341032)
                    .longitude(-7.869657)
                    .zoneId(locationService.getZoneIdByCoordinates(42.341032, -7.869657))
                    .isDefault(true)
                    .restaurant(adminRestaurant)
                    .build();

            Address savedAdminRestaurantAddress = addressRepository.save(adminRestaurantAddress);
            adminRestaurant.setAddress(savedAdminRestaurantAddress);

            Restaurant savedAdminRestaurant = restaurantRepository.save(adminRestaurant);

            initializeDashboard(savedAdminRestaurant, adminRole);
        }

        // Setup user
        if (userRepository.findByUsername("setup").isEmpty()) {
            User setup = User.builder()
                    .username("setup")
                    .password(passwordEncoder.encode(adminPassword))
                    .email("setup@setup.com")
                    .role(adminRole)
                    .build();

            Account setupAccount = Account.builder().user(setup).onboardingCompleted(false).build();

            userRepository.save(setup);
            accountRepository.save(setupAccount);
        }
    }

    private void initializeDashboard(Restaurant restaurant, UserRole adminRole) {
        dashboardService.initializeDashboard(restaurant);
    }

    private void createRuleTypeIfNotFound(String name, Integer priority, String description) {
        ruleTypeRepository.findByName(name).ifPresentOrElse(
                _ -> {
                }, // Ya existe, no hacemos nada
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
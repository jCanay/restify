package org.canay.backend.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.entities.*;
import org.canay.backend.repository.*;
import org.canay.backend.service.DashboardService;
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
    private final DashboardService dashboardService;
    private final WidgetRepository widgetRepository;

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

        // 1. Crear el Dashboard si el restaurante no tiene uno
        /*Dashboard dashboard = dashboardRepository.findByRestaurant(restaurant)
                .orElseGet(() -> {
                    Dashboard newDashboard = Dashboard.builder()
                            .restaurant(restaurant)
                            .build();
                    Dashboard savedDashboard = dashboardRepository.save(newDashboard);

                    // CRUCIAL: Actualizar el restaurante con su nuevo dashboard
                    restaurant.setDashboard(savedDashboard);
                    restaurantRepository.save(restaurant);

                    return savedDashboard;
                });

        // 2. Crear la página "Reservas" si no existe
        DashboardPage reservationsPage = dashboardPageRepository.findByTitleAndDashboard("Reservas", dashboard)
                .orElseGet(() -> {
                    try {
                        return dashboardPageRepository.save(DashboardPage.builder()
                                .title("Reservas")
                                .dashboard(dashboard)
                                .slug("bookings")
                                .tabs(objectMapper.readTree("""
                                        [
                                            {
                                                "name": "Historial",
                                                "path": "history"
                                            },
                                            {
                                                "name": "Estadísticas",
                                                "path": "stats"
                                            }
                                        ]
                                        """))
                                .build());
                    } catch (Exception e) {
                        throw new RuntimeException("Error parsing tabs JSON", e);
                    }
                });

        // 3. Crear Widgets iniciales
        createWidgetIfNotFound(WidgetType.CRUD_MANAGER, reservationsPage, Set.of(adminRole), """
                {
                    "lg": {"x": 0,"y": 0,"w": 1,"h": 1},
                    "md": {"x": 0,"y": 0,"w": 1,"h": 1},
                    "sm": {"x": 0,"y": 0,"w": 1,"h": 1},
                    "xs": {"x": 0,"y": 0,"w": 1,"h": 1}
                }
                """);*/

    }

    private void createWidgetIfNotFound(WidgetType type, DashboardPage page, Set<UserRole> roles, String layoutJson) {
        if (widgetRepository.findByTypeAndDashboardPage(type, page).isEmpty()) {
            try {
                Widget widget = Widget.builder()
                        .type(type)
                        .dashboardPage(page)
                        .accessRoles(new HashSet<>(roles))
                        .layouts(objectMapper.readTree(layoutJson))
                        .build();
                widgetRepository.save(widget);
            } catch (Exception e) {
                throw new RuntimeException("Error creating widget: " + type, e);
            }
        }
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
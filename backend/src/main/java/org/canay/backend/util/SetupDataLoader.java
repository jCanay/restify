package org.canay.backend.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.entity.*;
import org.canay.backend.repository.*;
import org.canay.backend.service.DashboardService;
import org.canay.backend.service.LocationService;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class SetupDataLoader implements CommandLineRunner {
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final UserRoleRepository userRoleRepository;
    private final RestaurantRepository restaurantRepository;
    private final AvailabilityRuleTypeRepository ruleTypeRepository;
    private final DashboardRepository dashboardRepository;
    private final DashboardPageRepository dashboardPageRepository;
    private final WidgetRepository widgetRepository;
    private final AddressRepository addressRepository;
    private final ProductRepository productRepository;

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
    public void run(String @NonNull ... args) {
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

            Address adminAddress = Address.builder()
                    .label("Dirección")
                    .streetAddress("Calle Admin 1")
                    .city("Ourense")
                    .country("Spain")
                    .countryCode("es")
                    .zipCode("32002")
                    .floor("1A")
                    .latitude(42.341032)
                    .longitude(-7.869657)
//                    .location()
                    .zoneId(locationService.getZoneIdByCoordinates(42.341032, -7.869657))
                    .isDefault(true)
                    .account(savedAdminAccount)
                    .build();

            Address adminRealAddress = Address.builder()
                    .label("Dirección")
                    .streetAddress("Pura e Dora Vázquez 25")
                    .city("Ourense")
                    .country("Spain")
                    .countryCode("es")
                    .zipCode("32002")
                    .floor("1A")
                    .latitude(42.336000)
                    .longitude(-7.869383)
//                    .location()
                    .zoneId(locationService.getZoneIdByCoordinates(42.341032, -7.869657))
                    .isDefault(true)
                    .account(savedAdminAccount)
                    .build();

            Address savedAdminAddress = addressRepository.save(adminAddress);
            Address savedRealAdminAddress = addressRepository.save(adminRealAddress);
            adminAccount.setAddresses(List.of(savedAdminAddress, savedRealAdminAddress));

            Restaurant adminRestaurant = Restaurant.builder()
                    .name("Admin Restaurant")
                    .shippingCosts(BigDecimal.valueOf(1.99))
                    .deliveryRadiusMeters(10000.0)
                    .account(savedAdminAccount)
                    .isDefault(true)
                    .build();

            Restaurant savedAdminRestaurant = restaurantRepository.save(adminRestaurant);

            createAndSaveProducts(savedAdminRestaurant);

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

            dashboardService.initializeDashboard(savedAdminRestaurant, adminRole);
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

    public void createAndSaveProducts(Restaurant restaurant) {
        List<Product> products = List.of(
                // --- ENTRANTES (Starters) ---
                Product.builder()
                        .name("Bacon Cheese Fries")
                        .description("Crispy french fries topped with melted cheddar cheese and crispy bacon bits.")
                        .category("Starters")
                        .price(BigDecimal.valueOf(6.50))
                        .restaurant(restaurant)
                        .build(),
                Product.builder()
                        .name("BBQ Chicken Wings")
                        .description("8 pieces of juicy chicken wings tossed in our homemade smoky BBQ sauce.")
                        .category("Starters")
                        .price(BigDecimal.valueOf(7.90))
                        .restaurant(restaurant)
                        .build(),
                Product.builder()
                        .name("Onion Rings")
                        .description("Golden and crunchy beer-battered onion rings served with barbecue dip.")
                        .category("Starters")
                        .price(BigDecimal.valueOf(5.00))
                        .restaurant(restaurant)
                        .build(),

                // --- HAMBURGUESAS (Burgers) ---
                Product.builder()
                        .name("Classic Cheeseburger")
                        .description(
                                "180g of premium beef, cheddar cheese, lettuce, tomato, and our secret house sauce.")
                        .category("Burgers")
                        .price(BigDecimal.valueOf(9.50))
                        .restaurant(restaurant)
                        .build(),
                Product.builder()
                        .name("Smoky Bacon Burger")
                        .description("180g beef, crispy bacon, cheddar cheese, caramelized onions, and BBQ sauce.")
                        .category("Burgers")
                        .price(BigDecimal.valueOf(11.20))
                        .restaurant(restaurant)
                        .build(),
                Product.builder()
                        .name("Trifásica Burger")
                        .description(
                                "Double beef patty (360g), triple cheddar, triple bacon, and fried egg. Only for the brave.")
                        .category("Burgers")
                        .price(BigDecimal.valueOf(14.90))
                        .restaurant(restaurant)
                        .build(),
                Product.builder()
                        .name("Veggie Crunch")
                        .description("Crispy plant-based patty, vegan mayo, lettuce, avocado, and fresh tomato.")
                        .category("Burgers")
                        .price(BigDecimal.valueOf(10.50))
                        .restaurant(restaurant)
                        .build(),

                // --- POSTRES (Desserts) ---
                Product.builder()
                        .name("Chocolate Brownie")
                        .description("Warm chocolate brownie with walnuts, served with a scoop of vanilla ice cream.")
                        .category("Desserts")
                        .price(BigDecimal.valueOf(5.50))
                        .restaurant(restaurant)
                        .build(),
                Product.builder()
                        .name("New York Cheesecake")
                        .description("Classic creamy baked cheesecake with a sweet raspberry coulis on top.")
                        .category("Desserts")
                        .price(BigDecimal.valueOf(6.00))
                        .restaurant(restaurant)
                        .build(),

                // --- BEBIDAS (Drinks) ---
                Product.builder()
                        .name("Coca-Cola Original")
                        .description("Cold 330ml can of refreshing Coca-Cola.")
                        .category("Drinks")
                        .price(BigDecimal.valueOf(2.20))
                        .restaurant(restaurant)
                        .build()
        );

        productRepository.saveAll(products);
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
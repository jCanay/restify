package org.canay.backend.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.dto.*;
import org.canay.backend.domain.entity.*;
import org.canay.backend.repository.*;
import org.canay.backend.service.DashboardService;
import org.canay.backend.service.LocationService;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.ArrayList;
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
    private final ReviewRepository reviewRepository;

    private final DashboardService dashboardService;
    private final LocationService locationService;

    private final ObjectMapper objectMapper;
    private final PasswordEncoder passwordEncoder;

    private final Environment environment;

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

            List<Review> reviews = new ArrayList<>(List.of(
                    Review.builder().rating(5).restaurant(savedAdminRestaurant).build(),
                    Review.builder().rating(5).restaurant(savedAdminRestaurant).build(),
                    Review.builder().rating(5).restaurant(savedAdminRestaurant).build(),
                    Review.builder().rating(5).restaurant(savedAdminRestaurant).build(),
                    Review.builder().rating(5).restaurant(savedAdminRestaurant).build(),
                    Review.builder().rating(5).restaurant(savedAdminRestaurant).build(),
                    Review.builder().rating(5).restaurant(savedAdminRestaurant).build(),
                    Review.builder().rating(5).restaurant(savedAdminRestaurant).build(),
                    Review.builder().rating(4).restaurant(savedAdminRestaurant).build(),
                    Review.builder().rating(3).restaurant(savedAdminRestaurant).build()
            ));

            reviews.forEach(reviewRepository::save);

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

        // Cargar datos iniciales (solo en dev)
        boolean isDevProfile = Arrays.asList(environment.getActiveProfiles()).contains("dev");

        if (isDevProfile) {
            loadDevelopmentDataset(adminRole);
        }
    }

    private void loadDevelopmentDataset(UserRole adminRole) {
        try {
            InputStream inputStream = getClass().getResourceAsStream("/data/data.json");
            if (inputStream == null) return;

            List<SetupDataDTO> ownersToImport = objectMapper.readValue(
                    inputStream,
                    new TypeReference<>() {}
            );

            for (SetupDataDTO dto : ownersToImport) {
                UserDTO userDTO = dto.getUser();
                AccountDTO accountDTO = dto.getAccount();
                RestaurantDTO restDTO = dto.getRestaurantDetail().getRestaurant();
                AddressDTO addressDTO = restDTO.getAddress();

                if (userRepository.findByUsername(userDTO.getUsername()).isPresent()) {
                    continue;
                }

                // Paso A: Crear el usuario dueño de prueba
                User user = User.builder()
                        .username(userDTO.getUsername())
                        .email(userDTO.getEmail())
                        .password(passwordEncoder.encode(dto.getPassword()))
                        .role(adminRole)
                        .build();
                User savedUser = userRepository.save(user);

                // Paso B: Crear la cuenta asociada
                Account account = Account.builder()
                        .user(savedUser)
                        .name(accountDTO.getName())
                        .surname(accountDTO.getSurname())
                        .onboardingCompleted(accountDTO.getOnboardingCompleted())
                        .build();
                Account savedAccount = accountRepository.save(account);

                // Paso C: Dirección de la cuenta
                Address accountAddress = Address.builder()
                        .label(addressDTO.getLabel())
                        .streetAddress(addressDTO.getStreetAddress())
                        .city(addressDTO.getCity())
                        .country(addressDTO.getCountry())
                        .countryCode(addressDTO.getCountryCode())
                        .zipCode(addressDTO.getZipCode())
                        .floor(addressDTO.getFloor())
                        .latitude(addressDTO.getLatitude())
                        .longitude(addressDTO.getLongitude())
                        .isDefault(addressDTO.getIsDefault())
                        .account(savedAccount)
                        .zoneId(locationService.getZoneIdByCoordinates(addressDTO.getLatitude(),
                                addressDTO.getLongitude()))
                        .build();
                Address savedAccountAddress = addressRepository.save(accountAddress);
                savedAccount.setAddresses(List.of(savedAccountAddress));

                // Paso D: Crear el restaurante
                Restaurant restaurant = Restaurant.builder()
                        .name(restDTO.getName())
                        .shippingCosts(restDTO.getShippingCosts())
                        .deliveryRadiusMeters(restDTO.getDeliveryRadiusMeters())
                        .account(savedAccount)
                        .isDefault(restDTO.getIsDefault())
                        .build();
                Restaurant savedRestaurant = restaurantRepository.save(restaurant);

                // Paso E: Dirección física del restaurante
                Address restaurantAddress = Address.builder()
                        .streetAddress(savedAccountAddress.getStreetAddress())
                        .city(savedAccountAddress.getCity())
                        .country(savedAccountAddress.getCountry())
                        .countryCode(savedAccountAddress.getCountryCode())
                        .zipCode(savedAccountAddress.getZipCode())
                        .latitude(savedAccountAddress.getLatitude())
                        .longitude(savedAccountAddress.getLongitude())
                        .zoneId(savedAccountAddress.getZoneId())
                        .isDefault(true)
                        .restaurant(savedRestaurant)
                        .build();
                Address savedRestAddress = addressRepository.save(restaurantAddress);
                savedRestaurant.setAddress(savedRestAddress);

                // Paso F: Cargar catálogo de productos del restaurante
                List<ProductDTO> productsDTO = dto.getRestaurantDetail().getProducts();
                if (productsDTO != null && !productsDTO.isEmpty()) {
                    List<Product> products = productsDTO.stream()
                            .map(pDto -> Product.builder()
                                    .name(pDto.getName())
                                    .description(pDto.getDescription())
                                    .category(pDto.getCategory())
                                    .price(pDto.getPrice())
                                    .restaurant(savedRestaurant)
                                    .build())
                            .toList();

                    productRepository.saveAll(products);
                }

                // Paso G: Inicializar el Dashboard analítico
                dashboardService.initializeDashboard(savedRestaurant, adminRole);
            }

            System.out.println(">> [DEV] Ecosistema de pruebas cargado completamente desde el JSON. <<");

        } catch (IOException e) {
            throw new RuntimeException("Error al inyectar el set de datos de desarrollo", e);
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
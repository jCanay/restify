package org.canay.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.canay.backend.domain.dto.NearbyRestaurantsResponseDTO;
import org.canay.backend.domain.dto.ProductDTO;
import org.canay.backend.domain.dto.RestaurantDTO;
import org.canay.backend.domain.dto.RestaurantDetailDTO;
import org.canay.backend.domain.entity.*;
import org.canay.backend.exception.AccessDeniedException;
import org.canay.backend.exception.IllegalArgumentException;
import org.canay.backend.exception.ResourceNotFoundException;
import org.canay.backend.mapper.Mapper;
import org.canay.backend.repository.AccountRepository;
import org.canay.backend.repository.ProductRepository;
import org.canay.backend.repository.RestaurantRepository;
import org.canay.backend.service.DashboardService;
import org.canay.backend.service.RestaurantService;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RestaurantServiceImpl implements RestaurantService {
    private final RestaurantRepository restaurantRepository;
    private final AccountRepository accountRepository;
    private final ProductRepository productRepository;

    private final DashboardService dashboardService;
    private final MessageSource messageSource;

    private final Mapper<Restaurant, RestaurantDTO> restaurantMapper;
    private final Mapper<Product, ProductDTO> productMapper;

    @Transactional
    @Override
    public RestaurantDTO addRestaurant(RestaurantDTO restaurantDTO, User user) {
        Restaurant restaurant = restaurantMapper.mapFrom(restaurantDTO);
        System.out.println(restaurantDTO);
        System.out.println(restaurant);

        // Verifica que exista la cuenta para continuar
        Account account = accountRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        restaurant.setAccount(account);

        // Establece el restaurante a la dirección
        if (restaurant.getAddress() != null) {
            Address address = restaurant.getAddress();

            address.setRestaurant(restaurant);
            address.setAccount(null);
        }

        if (restaurantRepository.countByAccount(account) == 0) {
            restaurant.setIsDefault(true);
        }

        Restaurant savedRestaurant = restaurantRepository.save(restaurant);
        System.out.println(user.getRole());
        dashboardService.initializeDashboard(savedRestaurant, user.getRole());

        return restaurantMapper.mapTo(savedRestaurant);
    }

    @Override
    public Page<RestaurantDTO> getRestaurants(String countryCode, String city, Pageable pageable, User user) {
        boolean countryCodeEmpty = countryCode == null || countryCode.trim().isEmpty();
        boolean cityEmpty = city == null || city.trim().isEmpty();

        if (countryCodeEmpty && !cityEmpty) {
            throw new IllegalArgumentException(
                    messageSource.getMessage(
                            "illegal-argument.restaurant.location-filter", null,
                            LocaleContextHolder.getLocale()
                    ));
        }

        if (countryCodeEmpty) {
            if (user == null) {
                throw new AccessDeniedException(messageSource.getMessage(
                        "access-denied",
                        new String[]{messageSource.getMessage(
                                "http.get", null,
                                LocaleContextHolder.getLocale()
                        )},
                        LocaleContextHolder.getLocale()
                ));
            }

            restaurantRepository.findAll(pageable).getContent().forEach(System.out::println);

            return restaurantRepository.findAll(pageable).map(restaurantMapper::mapTo);
        }

        if (!cityEmpty) {
            return restaurantRepository
                    .findByAddressCountryCodeIgnoreCaseAndAddressCityIgnoreCase(countryCode, city, pageable)
                    .map(restaurantMapper::mapTo);
        }
        System.out.println(restaurantRepository
                .findByAddressCountryCodeIgnoreCase(countryCode, pageable)
                .map(restaurantMapper::mapTo));
        return restaurantRepository
                .findByAddressCountryCodeIgnoreCase(countryCode, pageable)
                .map(restaurantMapper::mapTo);
    }

    @Override
    public NearbyRestaurantsResponseDTO findNearbyRestaurants(
            Double latitude,
            Double longitude,
            Pageable pageable,
            User user
    ) {
        Point location = createPoint(latitude, longitude);
        Page<Restaurant> restaurants = restaurantRepository.findNearbyRestaurants(location, pageable);

        if (restaurants.isEmpty()) {
            return NearbyRestaurantsResponseDTO.builder()
                    .countryCode(null)
                    .city(null)
                    .restaurants(Page.empty())
                    .empty(true)
                    .build();
        }

        String rawCity = restaurants.getContent().getFirst().getAddress().getCity();
        String city = "";
        String countryCode = restaurants.getContent().getFirst().getAddress().getCountryCode();

        if (rawCity != null) {
            String noAccents = StringUtils.stripAccents(rawCity);

            // 2. Pasamos a minúsculas, cambiamos espacios por guiones y limpiamos extremos
            city = noAccents.toLowerCase()
                    .trim()
                    .replaceAll("\\s+", "-"); // Convierte "A Coruña" en "a-coruna"
        }

        return NearbyRestaurantsResponseDTO.builder()
                .countryCode(countryCode)
                .city(city)
                .restaurants(restaurants.map(restaurantMapper::mapTo))
                .empty(false)
                .build();
    }

    private Point createPoint(Double latitude, Double longitude) {
        // Definimos el mismo sistema espacial (SRID 4326)
        GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

        // OJO: En JTS, el orden de los argumentos de Coordinate SIEMPRE es (X, Y) -> (Longitud, Latitud)
        return geometryFactory.createPoint(new Coordinate(longitude, latitude));
    }

    @Override
    public RestaurantDetailDTO getRestaurantDetail(String countryCode, String city, String slug, User user) {
        Restaurant restaurant = restaurantRepository.findByAddressCountryCodeIgnoreCaseAndAddressCityIgnoreCaseAndSlugIgnoreCase(
                countryCode,
                city,
                slug
        ).orElseThrow(() -> new ResourceNotFoundException("not-found.restaurant"));

        List<Product> products = productRepository.findByRestaurantId(restaurant.getId());

        return RestaurantDetailDTO.builder()
                .restaurant(restaurantMapper.mapTo(restaurant))
                .products(products.stream().map(productMapper::mapTo).toList())
                .build();
    }

}

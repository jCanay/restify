package org.canay.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.dto.LocationStatusDTO;
import org.canay.backend.domain.dto.RestaurantDTO;
import org.canay.backend.domain.entities.*;
import org.canay.backend.exception.AccessDeniedException;
import org.canay.backend.exception.IllegalArgumentException;
import org.canay.backend.exception.ResourceNotFoundException;
import org.canay.backend.mapper.Mapper;
import org.canay.backend.repository.AccountRepository;
import org.canay.backend.repository.RestaurantRepository;
import org.canay.backend.service.DashboardService;
import org.canay.backend.service.RestaurantService;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RestaurantServiceImpl implements RestaurantService {
    private final RestaurantRepository restaurantRepository;
    private final AccountRepository accountRepository;

    private final DashboardService dashboardService;
    private final MessageSource messageSource;

    private final Mapper<Restaurant, RestaurantDTO> restaurantMapper;

    @Transactional
    @Override
    public RestaurantDTO addRestaurant(RestaurantDTO restaurantDTO, User user) {
        Restaurant restaurant = restaurantMapper.mapFrom(restaurantDTO);

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
    @Transactional(readOnly = true)
    public LocationStatusDTO checkLocationStatus(String countryCode, String city, User user) {
        boolean countryExists = restaurantRepository.existsByAddressCountryCodeIgnoreCase(countryCode);

        boolean cityExists = restaurantRepository.existsByAddressCountryCodeIgnoreCaseAndAddressCityIgnoreCase(
                countryCode, city);

        long restaurantCount = 0;

        if (cityExists) {
            restaurantCount = restaurantRepository.countByAddressCountryCodeIgnoreCaseAndAddressCityIgnoreCase(
                    countryCode, city);
        } else if (countryExists) {
            restaurantCount = restaurantRepository.countByAddressCountryCodeIgnoreCase(countryCode);
        }

        return LocationStatusDTO.builder()
                .countryExists(countryExists)
                .cityExists(cityExists)
                .restaurantCount(restaurantCount)
                .build();
    }

    @Override
    public Page<RestaurantDTO> getRestaurants(String countryCode, String city, Pageable pageable, User user) {
        boolean countryCodeEmpty = countryCode == null || countryCode.trim().isEmpty();
        boolean cityEmpty = city == null || city.trim().isEmpty();

        if (countryCodeEmpty && !cityEmpty) {
            throw new IllegalArgumentException(
                    messageSource.getMessage("illegal-argument.restaurant.location-filter", null,
                            LocaleContextHolder.getLocale()));
        }

        if (countryCodeEmpty) {
            if (user == null) {
                throw new AccessDeniedException(messageSource.getMessage("access-denied",
                        new String[]{messageSource.getMessage("http.get", null,
                                LocaleContextHolder.getLocale())},
                        LocaleContextHolder.getLocale()));
            }

            return restaurantRepository.findAll(pageable).map(restaurantMapper::mapTo);
        }

        if (!cityEmpty) {
            return restaurantRepository
                    .findByAddressCountryCodeIgnoreCaseAndAddressCityIgnoreCase(countryCode, city, pageable)
                    .map(restaurantMapper::mapTo);
        }

        return restaurantRepository
                .findByAddressCountryCodeIgnoreCase(countryCode, pageable)
                .map(restaurantMapper::mapTo);
    }
}

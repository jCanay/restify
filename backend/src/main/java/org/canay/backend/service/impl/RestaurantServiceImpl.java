package org.canay.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.dto.RestaurantDTO;
import org.canay.backend.domain.entities.Account;
import org.canay.backend.domain.entities.Dashboard;
import org.canay.backend.domain.entities.Restaurant;
import org.canay.backend.domain.entities.User;
import org.canay.backend.exceptions.ResourceNotFoundException;
import org.canay.backend.mappers.Mapper;
import org.canay.backend.repository.AccountRepository;
import org.canay.backend.repository.RestaurantRepository;
import org.canay.backend.service.DashboardService;
import org.canay.backend.service.RestaurantService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RestaurantServiceImpl implements RestaurantService {
    private final RestaurantRepository restaurantRepository;
    private final AccountRepository accountRepository;

    private final DashboardService dashboardService;

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
            if (restaurant.getAddress().getRestaurant() != null) {
                restaurant.getAddress().setRestaurant(restaurant);
                restaurant.getAddress().setAccount(null);
            } else if (restaurant.getAddress().getAccount() != null) {
                restaurant.getAddress().setAccount(account);
                restaurant.getAddress().setRestaurant(null);
            }

        }

        if (restaurantRepository.countByAccount(account) == 0) {
            restaurant.setIsDefault(true);
        }

        Restaurant savedRestaurant = restaurantRepository.save(restaurant);

        dashboardService.initializeDashboard(savedRestaurant);

        return restaurantMapper.mapTo(savedRestaurant);
    }
}

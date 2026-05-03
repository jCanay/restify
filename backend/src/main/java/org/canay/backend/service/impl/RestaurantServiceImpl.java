package org.canay.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.dto.RestaurantDTO;
import org.canay.backend.domain.entities.Account;
import org.canay.backend.domain.entities.Restaurant;
import org.canay.backend.exceptions.ResourceNotFoundException;
import org.canay.backend.mappers.Mapper;
import org.canay.backend.repository.AccountRepository;
import org.canay.backend.repository.RestaurantRepository;
import org.canay.backend.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RestaurantServiceImpl implements RestaurantService {
    private final RestaurantRepository restaurantRepository;
    private final AccountRepository accountRepository;

    private final Mapper<Restaurant, RestaurantDTO> restaurantMapper;

    @Override
    public ResponseEntity<RestaurantDTO> addRestaurant(RestaurantDTO restaurantDTO, Long userId) {
        Restaurant restaurant = restaurantMapper.mapFrom(restaurantDTO);

        // Verifica que exista la cuenta para continuar
        Account account = accountRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        restaurant.setAccount(account);

        // Establece el restaurante a las direcciones
        if (restaurant.getAddresses() != null) {
            restaurant.getAddresses().forEach(address -> address.setRestaurant(restaurant));
        }

        Restaurant savedRestaurant = restaurantRepository.save(restaurant);

        return new ResponseEntity<>(restaurantMapper.mapTo(savedRestaurant), HttpStatus.CREATED);
    }
}

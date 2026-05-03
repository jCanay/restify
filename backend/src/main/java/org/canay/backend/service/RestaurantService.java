package org.canay.backend.service;

import org.canay.backend.domain.dto.RestaurantDTO;
import org.springframework.http.ResponseEntity;

public interface RestaurantService {
    ResponseEntity<RestaurantDTO> addRestaurant(RestaurantDTO restaurantDTO, Long userId);
}

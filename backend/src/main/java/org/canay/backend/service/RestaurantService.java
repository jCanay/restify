package org.canay.backend.service;

import org.canay.backend.domain.dto.LocationStatusDTO;
import org.canay.backend.domain.dto.RestaurantDTO;
import org.canay.backend.domain.entities.User;
import org.springframework.http.ResponseEntity;

public interface RestaurantService {
    RestaurantDTO addRestaurant(RestaurantDTO restaurantDTO, User user);

    LocationStatusDTO checkLocationStatus(String countryCode, String city, User user);
}

package org.canay.backend.service;

import org.canay.backend.domain.dto.LocationStatusDTO;
import org.canay.backend.domain.dto.RestaurantDTO;
import org.canay.backend.domain.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RestaurantService {
    RestaurantDTO addRestaurant(RestaurantDTO restaurantDTO, User user);

    LocationStatusDTO checkLocationStatus(String countryCode, String city, User user);

    Page<RestaurantDTO> getRestaurants(String countryCode, String city, Pageable pageable, User user);
}

package org.canay.backend.service;

import org.canay.backend.domain.dto.NearbyRestaurantsResponseDTO;
import org.canay.backend.domain.dto.RestaurantDTO;
import org.canay.backend.domain.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RestaurantService {
    RestaurantDTO addRestaurant(RestaurantDTO restaurantDTO, User user);

    Page<RestaurantDTO> getRestaurants(String countryCode, String city, Pageable pageable, User user);

    NearbyRestaurantsResponseDTO findNearbyRestaurants(Double latitude, Double longitude, Pageable pageable, User user);
}

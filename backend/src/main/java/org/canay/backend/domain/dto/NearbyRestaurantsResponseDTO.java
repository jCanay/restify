package org.canay.backend.domain.dto;

import lombok.Builder;
import org.springframework.data.domain.Page;

@Builder
public record NearbyRestaurantsResponseDTO(String countryCode, String city, Page<RestaurantDTO> restaurants,
                                           Boolean empty) {
}
package org.canay.backend.mappers.impl;

import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.dto.RestaurantDTO;
import org.canay.backend.domain.entities.Restaurant;
import org.canay.backend.mappers.Mapper;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RestaurantMapper implements Mapper<Restaurant, RestaurantDTO> {
    private final ModelMapper modelMapper;

    @Override
    public RestaurantDTO mapTo(Restaurant restaurant) {
        return modelMapper.map(restaurant, RestaurantDTO.class);
    }

    @Override
    public Restaurant mapFrom(RestaurantDTO restaurantDTO) {
        return modelMapper.map(restaurantDTO, Restaurant.class);
    }
}

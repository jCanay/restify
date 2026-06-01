package org.canay.backend.domain.dto;

import lombok.Builder;

@Builder
public record LocationStatusDTO(
        Boolean countryExists,
        Boolean cityExists,
        Long restaurantCount
) {}
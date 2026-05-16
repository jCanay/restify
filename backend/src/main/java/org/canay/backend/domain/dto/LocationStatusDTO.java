package org.canay.backend.domain.dto;

import lombok.Builder;

@Builder
public record LocationStatusDTO(
        boolean countryExists,
        boolean cityExists,
        long restaurantCount
) {}
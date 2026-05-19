package org.canay.backend.domain.dto;

import lombok.Builder;

@Builder
public record LocationDTO(String countryCode, String city, String postalCode, Double latitude, Double longitude) {
}

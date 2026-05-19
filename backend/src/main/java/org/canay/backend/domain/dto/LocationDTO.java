package org.canay.backend.domain.dto;

public record LocationDTO(String countryCode, String city, String postalCode, Double latitude, Double longitude) {
}

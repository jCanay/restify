package org.canay.backend.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.bfsmith.geotimezone.TimeZoneLookup;
import com.github.bfsmith.geotimezone.TimeZoneResult;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.canay.backend.domain.dto.LocationDTO;
import org.canay.backend.domain.dto.LocationStatusDTO;
import org.canay.backend.domain.entity.User;
import org.canay.backend.exception.ExternalServiceException;
import org.canay.backend.exception.IllegalArgumentException;
import org.canay.backend.exception.ResourceNotFoundException;
import org.canay.backend.repository.RestaurantRepository;
import org.canay.backend.service.LocationService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.ZoneId;
import java.util.Arrays;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class LocationServiceImpl implements LocationService {

    private final RestaurantRepository restaurantRepository;

    @Value("${maptiler.api.key}")
    private String maptilerKey;

    private final TimeZoneLookup zoneLookup;

    private final WebClient.Builder webClientBuilder;

    @Override
    public ZoneId getZoneIdByCoordinates(double latitude, double longitude) {
        TimeZoneResult result = zoneLookup.getTimeZone(latitude, longitude);

        if (result == null || result.getResult() == null) {
            throw new ResourceNotFoundException("not-found.location.zone-id");
        }

        String zoneName = result.getResult();

        return ZoneId.of(zoneName);
    }

    @Override
    @Transactional(readOnly = true)
    public LocationStatusDTO checkLocationStatus(String countryCode, String city, User user) {
        boolean countryExists = restaurantRepository.existsByAddressCountryCodeIgnoreCase(countryCode);

        boolean cityExists = restaurantRepository.existsByAddressCountryCodeIgnoreCaseAndAddressCityIgnoreCase(
                countryCode, city);

        long restaurantCount = 0;

        if (cityExists) {
            restaurantCount = restaurantRepository.countByAddressCountryCodeIgnoreCaseAndAddressCityIgnoreCase(
                    countryCode, city);
        } else if (countryExists) {
            restaurantCount = restaurantRepository.countByAddressCountryCodeIgnoreCase(countryCode);
        }

        return LocationStatusDTO.builder()
                .countryExists(countryExists)
                .cityExists(cityExists)
                .restaurantCount(restaurantCount)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public LocationStatusDTO checkLocationStatusByCoordinates(Double latitude, Double longitude, User user) {
        LocationDTO locationDTO = getLocationByCoordinates(latitude, longitude, user);

        return checkLocationStatus(locationDTO.countryCode(), locationDTO.city(), user);
    }

    @Override
    public LocationDTO getLocationByCoordinates(double latitude, double longitude, User user) {
        WebClient webClient = webClientBuilder
                .baseUrl("https://api.maptiler.com")
                .defaultHeader("Origin", "http://localhost:8080")
                .defaultHeader("Referer", "http://localhost:8080/")
                .defaultHeader("User-Agent", maptilerKey)
                .build();

        try {
            String url = UriComponentsBuilder
                    .fromUriString("https://api.maptiler.com/geocoding/" + longitude + "," + latitude + ".json")
                    .queryParam("key", maptilerKey)
                    .queryParam("language", "es")
                    .queryParam("limit", "1")
                    .build()
                    .toUriString();

            // CORRECCIÓN 1: Pedimos la respuesta como un String plano para evitar errores de Codec/Jackson
            String jsonString = webClient.get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            if (jsonString == null || jsonString.isBlank()) {
                throw new ExternalServiceException("error.location.provider-fetch");
            }

            ObjectMapper mapper = new ObjectMapper();
            JsonNode response = mapper.readTree(jsonString);

            if (!response.has("features") || response.get("features").isEmpty()) {
                throw new ExternalServiceException("error.location.provider-fetch");
            }

            JsonNode firstFeature = response.get("features").get(0);

            String postalCode = "";
            String city = "";
            String countryCode = "";

            if (firstFeature.has("id") && firstFeature.get("id").asText().startsWith("postal_code")) {
                postalCode = firstFeature.get("text").asText();
            }

            if (firstFeature.has("context")) {
                for (JsonNode ctx : firstFeature.get("context")) {
                    String id = ctx.get("id").asText();

                    if (id.startsWith("postal_code") && postalCode.isEmpty()) {
                        postalCode = ctx.get("text").asText();
                    } else if (id.startsWith("place") || id.startsWith("municipality")) {
                        city = ctx.get("text").asText();
                    } else if (id.startsWith("country")) {
                        if (ctx.has("country_code") && !ctx.get("country_code").isNull()) {
                            countryCode = ctx.get("country_code").asText().toLowerCase();
                        } else if (ctx.has("short_code") && !ctx.get("short_code").isNull()) {
                            countryCode = ctx.get("short_code").asText().toLowerCase();
                        } else if (ctx.has("text")) {
                            countryCode = ctx.get("text").asText().toLowerCase();
                        }
                    }
                }
            }

            if (countryCode.isEmpty() || !Arrays.stream(Locale.getISOCountries())
                    .toList()
                    .contains(countryCode.toUpperCase())) {
                throw new IllegalArgumentException("El código de país es incorrecto: " + countryCode);
            }

            if (city.isEmpty() && firstFeature.has("text")) {
                city = firstFeature.get("text").asText();
            }

            return LocationDTO.builder()
                    .countryCode(countryCode)
                    .city(StringUtils.stripAccents(city.toLowerCase()))
                    .postalCode(postalCode)
                    .latitude(latitude)
                    .longitude(longitude)
                    .build();

        } catch (IllegalArgumentException | ExternalServiceException e) {
            throw e;
        } catch (Exception e) {
            throw new ResourceNotFoundException(
                    "No se pudo obtener información de la localización para las coordenadas dadas.");
        }
    }


}
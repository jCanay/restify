package org.canay.backend.service;

import org.canay.backend.domain.dto.LocationDTO;
import org.canay.backend.domain.dto.LocationStatusDTO;
import org.canay.backend.domain.entity.User;

import java.time.ZoneId;

public interface LocationService {
    ZoneId getZoneIdByCoordinates(double latitude, double longitude);

    LocationStatusDTO checkLocationStatus(String countryCode, String city, User user);

    LocationStatusDTO checkLocationStatusByCoordinates(Double latitude, Double longitude, User user);

    LocationDTO getLocationByCoordinates(double latitude, double longitude, User user);
}

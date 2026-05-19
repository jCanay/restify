package org.canay.backend.service;

import org.canay.backend.domain.dto.LocationDTO;

import java.time.ZoneId;

public interface LocationService {
    ZoneId getZoneIdByCoordinates(double latitude, double longitude);

    LocationDTO getLocationByCoordinates(double latitude, double longitude);
}

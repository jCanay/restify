package org.canay.backend.service;

import java.time.ZoneId;

public interface LocationService {
    ZoneId getZoneIdByCoordinates(double latitude, double longitude);
}

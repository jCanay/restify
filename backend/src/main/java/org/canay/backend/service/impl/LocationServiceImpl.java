package org.canay.backend.service.impl;

import com.github.bfsmith.geotimezone.TimeZoneLookup;
import com.github.bfsmith.geotimezone.TimeZoneResult;
import lombok.RequiredArgsConstructor;
import org.canay.backend.exception.ResourceNotFoundException;
import org.canay.backend.service.LocationService;
import org.springframework.stereotype.Service;

import java.time.ZoneId;

@Service
@RequiredArgsConstructor
public class LocationServiceImpl implements LocationService {

    private final TimeZoneLookup zoneLookup;

    @Override
    public ZoneId getZoneIdByCoordinates(double latitude, double longitude) {
        TimeZoneResult result = zoneLookup.getTimeZone(latitude, longitude);

        if (result == null || result.getResult() == null) {
            throw new ResourceNotFoundException("No se encontró zona horaria para las coordenadas");
        }

        String zoneName = result.getResult();

        return ZoneId.of(zoneName);
    }
}
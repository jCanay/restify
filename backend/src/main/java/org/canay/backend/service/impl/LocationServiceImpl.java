package org.canay.backend.service.impl;

import com.github.bfsmith.geotimezone.TimeZoneLookup;
import com.github.bfsmith.geotimezone.TimeZoneResult;
import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.dto.LocationDTO;
import org.canay.backend.exception.ResourceNotFoundException;
import org.canay.backend.service.LocationService;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.ZoneId;

@Service
@RequiredArgsConstructor
public class LocationServiceImpl implements LocationService {

    private final TimeZoneLookup zoneLookup;

    private final MessageSource messageSource;

    @Override
    public ZoneId getZoneIdByCoordinates(double latitude, double longitude) {
        TimeZoneResult result = zoneLookup.getTimeZone(latitude, longitude);

        if (result == null || result.getResult() == null) {
            throw new ResourceNotFoundException(messageSource.getMessage(
                    "not-found.location.zone-id", null,
                    LocaleContextHolder.getLocale()
            ));
        }

        String zoneName = result.getResult();

        return ZoneId.of(zoneName);
    }

    
}
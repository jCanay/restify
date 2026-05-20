package org.canay.backend.controller.v1;

import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.dto.LocationDTO;
import org.canay.backend.domain.dto.LocationStatusDTO;
import org.canay.backend.domain.entity.User;
import org.canay.backend.service.LocationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/locations")
@RequiredArgsConstructor
public class LocationController {
    private final LocationService locationService;

    @GetMapping("/search")
    public ResponseEntity<LocationDTO> getLocationByCoordinates(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(locationService.getLocationByCoordinates(latitude, longitude, user));
    }

    @GetMapping("/{countryCode}/status")
    public ResponseEntity<LocationStatusDTO> checkLocationStatus(
            @PathVariable String countryCode,
            @RequestParam(required = false) String city,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(locationService.checkLocationStatus(countryCode, city, user));
    }

    @GetMapping("/status")
    public ResponseEntity<LocationStatusDTO> checkLocationStatusByCoordinates(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(locationService.checkLocationStatusByCoordinates(latitude, longitude, user));
    }
}

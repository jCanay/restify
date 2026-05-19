package org.canay.backend.controller.v1;

import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.dto.LocationDTO;
import org.canay.backend.service.LocationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/location")
@RequiredArgsConstructor
public class LocationController {
    private final LocationService locationService;

    @GetMapping("/search")
    public ResponseEntity<LocationDTO> getLocationByCoordinates(@RequestParam double latitude, @RequestParam double longitude) {
        return ResponseEntity.ok(locationService.getLocationByCoordinates(latitude, longitude));
    }
}

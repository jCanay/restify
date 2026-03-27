package org.canay.backend.controllers;

import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.dto.AvailabilityRuleRequestDTO;
import org.canay.backend.dto.AvailabilityRuleRequest;
import org.canay.backend.service.AvailabilityRuleService;
import org.canay.backend.service.AvailabilityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants/{restaurantId}/schedule")
@RequiredArgsConstructor
public class AvailabilityRuleController {

    private final AvailabilityRuleService availabilityService;

    @PostMapping
    public ResponseEntity<String> updateSchedule(
            @PathVariable Long restaurantId,
            @RequestBody List<AvailabilityRuleRequestDTO> scheduleRequest) {

        availabilityService.updateSchedule(restaurantId, scheduleRequest);
        return ResponseEntity.ok("Horario actualizado correctamente con registro histórico.");
    }

    // Endpoint para que el cliente sepa si puede pedir YA
    @GetMapping("/is-open")
    public ResponseEntity<Boolean> checkStatus(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(availabilityService.isOpenNow(restaurantId));
    }
}
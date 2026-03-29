package org.canay.backend.controller.v1;

import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.dto.AvailabilityRuleRequestDTO;
import org.canay.backend.domain.dto.ScheduleDTO;
import org.canay.backend.service.ScheduleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/restaurants/{restaurantId}/schedule")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;

    @PostMapping
    public ResponseEntity<String> updateSchedule(
            @PathVariable Long restaurantId,
            @RequestBody List<AvailabilityRuleRequestDTO> scheduleRequest) {

        scheduleService.updateSchedule(restaurantId, scheduleRequest);
        return ResponseEntity.ok("Horario actualizado correctamente con registro histórico.");
    }

    @GetMapping("/routine")
    public ResponseEntity<List<ScheduleDTO>> getWeeklyRoutine(@PathVariable Long restaurantId) {
        List<ScheduleDTO> routine = scheduleService.getRestaurantRoutine(restaurantId);
        return ResponseEntity.ok(routine);
    }

    // Endpoint para que el cliente sepa si puede pedir YA
    @GetMapping("/is-open")
    public ResponseEntity<Boolean> checkStatus(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(scheduleService.isOpenNow(restaurantId));
    }
}
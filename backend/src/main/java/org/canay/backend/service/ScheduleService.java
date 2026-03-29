package org.canay.backend.service;

import org.canay.backend.domain.dto.AvailabilityRuleRequestDTO;
import org.canay.backend.domain.dto.ScheduleDTO;

import java.util.List;

public interface ScheduleService {
    boolean isOpenNow(Long restaurantId);
    void updateSchedule(Long restaurantId, List<AvailabilityRuleRequestDTO> requests);
    List<ScheduleDTO> getRestaurantRoutine(Long restaurantId);
}

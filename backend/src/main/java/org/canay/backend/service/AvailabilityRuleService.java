package org.canay.backend.service;

import org.canay.backend.domain.dto.AvailabilityRuleRequestDTO;

import java.util.List;

public interface AvailabilityRuleService {
    boolean isOpenNow(Long restaurantId);
    void updateSchedule(Long restaurantId, List<AvailabilityRuleRequestDTO> requests);
}

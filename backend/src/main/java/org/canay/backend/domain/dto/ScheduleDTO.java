package org.canay.backend.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ScheduleDTO {
    private Integer dayOfWeek;

    @Builder.Default
    private Boolean isClosed = true;
    private List<TimeSlotDTO> slots;
}

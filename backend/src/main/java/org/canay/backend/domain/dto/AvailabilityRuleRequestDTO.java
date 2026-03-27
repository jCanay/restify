package org.canay.backend.domain.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AvailabilityRuleRequestDTO {
    private String typeName;      // "RECURRING", "VACATION", "SPECIFIC_DATE"
    private Integer dayOfWeek;    // 0-6
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalTime openTime;
    private LocalTime closeTime;
    private Boolean isClosed;
}
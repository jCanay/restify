package org.canay.backend.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AvailabilityRuleRequestDTO {
    private String typeName;      // "RECURRING", "VACATION", "SPECIFIC_DATE"
    private Integer dayOfWeek;    // 0-6
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalTime openTime;
    private LocalTime closeTime;
    private Boolean isClosed;
}
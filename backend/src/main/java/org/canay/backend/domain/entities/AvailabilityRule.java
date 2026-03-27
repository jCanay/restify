package org.canay.backend.domain.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "availability_rules")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilityRule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "type_id")
    private AvailabilityRuleType type;

    private Integer dayOfWeek;

    private LocalDate startDate;
    private LocalDate endDate;

    private LocalTime openTime;
    private LocalTime closeTime;

    private Boolean isClosed = false;

    private LocalDate effectiveDate;
    private LocalDate expiryDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id")
    private Restaurant restaurant;
}
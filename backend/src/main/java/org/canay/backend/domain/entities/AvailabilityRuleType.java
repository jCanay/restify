package org.canay.backend.domain.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "rule_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AvailabilityRuleType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name; // VACATION, SPECIFIC_DATE, RECURRING

    @Column(nullable = false)
    private Integer priority; // 1 = Máxima, 10 = Mínima

    private String description;
}
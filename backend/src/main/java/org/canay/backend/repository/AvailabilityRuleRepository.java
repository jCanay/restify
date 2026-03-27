package org.canay.backend.repository;

import org.canay.backend.domain.entities.AvailabilityRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface AvailabilityRuleRepository extends JpaRepository<AvailabilityRule, Long> {

    @Query("""
        SELECT r FROM AvailabilityRule r
        JOIN r.type t
        WHERE r.restaurant.id = :restaurantId
        AND (r.expiryDate IS NULL OR r.expiryDate >= :today)
        AND (
            (t.name = 'RECURRING' AND r.dayOfWeek = :dayOfWeek) OR
            (t.name = 'SPECIFIC_DATE' AND r.startDate = :today) OR
            (t.name = 'VACATION' AND :today BETWEEN r.startDate AND r.endDate)
        )
        ORDER BY t.priority ASC
    """)
    List<AvailabilityRule> findActiveRulesOrdered(
            @Param("restaurantId") Long restaurantId,
            @Param("dayOfWeek") Integer dayOfWeek,
            @Param("today") LocalDate today
    );

    List<AvailabilityRule> findByRestaurantIdAndType_NameAndExpiryDateIsNull(
            Long restaurantId,
            String typeName
    );
}
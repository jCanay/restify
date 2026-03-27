package org.canay.backend.repository;

import org.canay.backend.domain.entities.AvailabilityRuleType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AvailabilityRuleTypeRepository extends JpaRepository<AvailabilityRuleType, Long> {
    Optional<AvailabilityRuleType> findByName(String name);
}
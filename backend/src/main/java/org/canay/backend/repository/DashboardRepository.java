package org.canay.backend.repository;

import org.canay.backend.domain.entity.Dashboard;
import org.canay.backend.domain.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DashboardRepository extends JpaRepository<Dashboard, Long> {
    Optional<Dashboard> findByRestaurant(Restaurant restaurant);
}

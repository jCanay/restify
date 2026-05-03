package org.canay.backend.repository;

import org.canay.backend.domain.entities.Dashboard;
import org.canay.backend.domain.entities.DashboardPage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DashboardPageRepository extends JpaRepository<DashboardPage, Long> {
    Optional<DashboardPage> findByTitleAndDashboard(String title, Dashboard dashboard);
}

package org.canay.backend.repository;

import org.canay.backend.domain.entity.DashboardPage;
import org.canay.backend.domain.entity.Widget;
import org.canay.backend.domain.entity.WidgetType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WidgetRepository extends JpaRepository<Widget, Long> {
    Optional<Widget> findByTypeAndDashboardPage(WidgetType type, DashboardPage page);
}

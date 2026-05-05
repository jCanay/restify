package org.canay.backend.repository;

import org.canay.backend.domain.entities.DashboardPage;
import org.canay.backend.domain.entities.Widget;
import org.canay.backend.domain.entities.WidgetType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WidgetRepository extends JpaRepository<Widget, Long> {
    List<Widget> findByTypeAndDashboardPage(WidgetType type, DashboardPage page);
}

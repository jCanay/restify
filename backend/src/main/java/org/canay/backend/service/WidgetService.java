package org.canay.backend.service;

import org.canay.backend.domain.entities.DashboardPage;
import org.canay.backend.domain.entities.UserRole;
import org.canay.backend.domain.entities.Widget;
import org.canay.backend.domain.entities.WidgetType;

import java.util.Optional;
import java.util.Set;

public interface WidgetService {
    Optional<Widget> createWidgetIfNotFound(WidgetType type, DashboardPage page, Set<UserRole> roles, String layoutJson, UserRole accessRole);
}

package org.canay.backend.service;

import org.canay.backend.domain.entity.DashboardPage;
import org.canay.backend.domain.entity.UserRole;
import org.canay.backend.domain.entity.Widget;
import org.canay.backend.domain.entity.WidgetType;

import java.util.Optional;
import java.util.Set;

public interface WidgetService {
    Optional<Widget> createWidgetIfNotFound(WidgetType type, DashboardPage page, Set<UserRole> roles, String layoutJson, UserRole accessRole);
}

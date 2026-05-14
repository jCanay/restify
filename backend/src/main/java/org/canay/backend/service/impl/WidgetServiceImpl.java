package org.canay.backend.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.entities.DashboardPage;
import org.canay.backend.domain.entities.UserRole;
import org.canay.backend.domain.entities.Widget;
import org.canay.backend.domain.entities.WidgetType;
import org.canay.backend.repository.WidgetRepository;
import org.canay.backend.service.WidgetService;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class WidgetServiceImpl implements WidgetService {
    private final WidgetRepository widgetRepository;
    private final ObjectMapper objectMapper;

    @Override
    public Widget createWidgetIfNotFound(WidgetType type, DashboardPage page, Set<UserRole> roles, String layoutJson) {
        Widget widget = widgetRepository.findByTypeAndDashboardPage(type, page).orElse(null);

        if (widget != null) {
            return widget;
        }

        try {
            Widget newWidget = Widget.builder()
                    .type(type)
                    .dashboardPage(page)
                    .accessRoles(new HashSet<>(roles))
                    .layouts(objectMapper.readTree(layoutJson))
                    .build();

            return widgetRepository.save(newWidget);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error parsing JSON: " + type, e);
        }
    }
}

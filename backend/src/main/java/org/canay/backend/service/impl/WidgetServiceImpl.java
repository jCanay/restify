package org.canay.backend.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.entity.DashboardPage;
import org.canay.backend.domain.entity.UserRole;
import org.canay.backend.domain.entity.Widget;
import org.canay.backend.domain.entity.WidgetType;
import org.canay.backend.repository.WidgetRepository;
import org.canay.backend.service.WidgetService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class WidgetServiceImpl implements WidgetService {
    private final WidgetRepository widgetRepository;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public Optional<Widget> createWidgetIfNotFound(WidgetType type, DashboardPage page, Set<UserRole> roles, String layoutJson, UserRole accessRole) {
        Optional<Widget> widgetOpt = widgetRepository.findByTypeAndDashboardPage(type, page);

        if (widgetOpt.isPresent()) {
            return widgetOpt.get().getAccessRoles().contains(accessRole) ? widgetOpt : Optional.empty();
        }

        if (!roles.contains(accessRole)) return Optional.empty();

        try {
            Widget newWidget = Widget.builder()
                    .type(type)
                    .dashboardPage(page)
                    .accessRoles(new HashSet<>(roles))
                    .layouts(objectMapper.readTree(layoutJson))
                    .build();

            return Optional.of(widgetRepository.save(newWidget));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error parsing JSON: " + type, e);
        }
    }
}

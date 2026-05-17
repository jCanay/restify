package org.canay.backend.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.dto.DashboardDTO;
import org.canay.backend.domain.entities.*;
import org.canay.backend.exception.ResourceNotFoundException;
import org.canay.backend.mapper.Mapper;
import org.canay.backend.repository.*;
import org.canay.backend.service.DashboardService;
import org.canay.backend.service.WidgetService;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {
    private final AccountRepository accountRepository;
    private final RestaurantRepository restaurantRepository;
    private final DashboardRepository dashboardRepository;
    private final UserRoleRepository userRoleRepository;
    private final WidgetRepository widgetRepository;
    private final DashboardPageRepository dashboardPageRepository;

    private final WidgetService widgetService;

    private final Mapper<Dashboard, DashboardDTO> dashboardMapper;
    private final ObjectMapper objectMapper;

    private final MessageSource messageSource;

    @Override
    @Transactional(readOnly = true)
    public DashboardDTO getDashboardForUser(Long restaurantId, User user) {
        Account account = accountRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("not-found.account", null,
                        LocaleContextHolder.getLocale())));

        Restaurant restaurant = restaurantRepository.findAllByAccount(account)
                .stream()
                .filter(r -> r.getId().equals(restaurantId))
                .findFirst()
                .orElseThrow(() -> new AccessDeniedException(messageSource.getMessage("access-denied",
                        new String[]{messageSource.getMessage("http.get", null,
                                LocaleContextHolder.getLocale())},
                        LocaleContextHolder.getLocale())));

        Dashboard dashboard = restaurant.getDashboard();

        if (dashboard == null) {
            throw new ResourceNotFoundException(messageSource.getMessage("not-found.dashboard", null,
                    LocaleContextHolder.getLocale()));
        }

        return dashboardMapper.mapTo(dashboard);
    }

    @Override
    @Transactional
    public void initializeDashboard(Restaurant restaurant, UserRole role) {
        Dashboard dashboard = Dashboard.builder().restaurant(restaurant).build();
        Dashboard savedDashboard = dashboardRepository.save(dashboard);
        restaurant.setDashboard(savedDashboard);

        UserRole adminRole = userRoleRepository.findByName("ROLE_ADMIN")
                .orElseThrow(() -> new RuntimeException(messageSource.getMessage("not-found.user.role", null,
                        LocaleContextHolder.getLocale())));

        // Crear las páginas
        DashboardPage reservasPage = createPage("Reservas", "bookings", "", 2, savedDashboard, null);
        reservasPage.setTabs(createPageTabs("""
                [{"name": "Historial","path": "history"},{"name": "Estadísticas","path": "stats"}]
                """));
        DashboardPage savedReservasPage = dashboardPageRepository.save(reservasPage);

        // Crear y guardar el widget vinculado a la página guardada
        Optional<Widget> savedReservasWidgetOpt = widgetService.createWidgetIfNotFound(
                WidgetType.CRUD_MANAGER,
                savedReservasPage,
                Set.of(adminRole),
                """
                        {
                            "lg": {"x": 0,"y": 0,"w": 1,"h": 1},
                            "md": {"x": 0,"y": 0,"w": 1,"h": 1},
                            "sm": {"x": 0,"y": 0,"w": 1,"h": 1},
                            "xs": {"x": 0,"y": 0,"w": 1,"h": 1}
                        }
                        """,
                role
        );

        List<Widget> widgets = new ArrayList<>();
        savedReservasWidgetOpt.ifPresent(widgets::add);
        savedReservasPage.setWidgets(widgets);

        // Agrupar las páginas
        List<DashboardPage> pages = new ArrayList<>(List.of(
                createPage("Inicio", "", "", 1, dashboard, List.of()),
                savedReservasPage,
                createPage("Pedidos", "orders", "", 3, dashboard, List.of()),
                createPage("Restaurante", "restaurant", "", 4, dashboard, List.of()),
                createPage("Menú", "menu", "", 5, dashboard, List.of()),
                createPage("Plantilla", "staff", "", 6, dashboard, List.of())
        ));
        pages.sort(Comparator.comparingLong(DashboardPage::getSortOrder));
        savedDashboard.setPages(pages);

        restaurantRepository.save(restaurant);
    }

    private DashboardPage createPage(
            String title,
            String slug,
            String tabs,
            Integer order,
            Dashboard dashboard,
            List<Widget> widgets
    ) {
        try {
            return DashboardPage.builder()
                    .title(title)
                    .slug(slug)
                    .sortOrder(order)
                    .tabs(objectMapper.readTree(tabs))
                    .widgets(widgets)
                    .dashboard(dashboard)
                    .build();
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    private JsonNode createPageTabs(String tabsJson) {
        try {
            return objectMapper.readTree(tabsJson);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
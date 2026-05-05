package org.canay.backend.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.dto.DashboardDTO;
import org.canay.backend.domain.entities.*;
import org.canay.backend.exceptions.ResourceNotFoundException;
import org.canay.backend.mappers.Mapper;
import org.canay.backend.repository.*;
import org.canay.backend.service.DashboardService;
import org.canay.backend.service.WidgetService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

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

    @Override
    public DashboardDTO getDashboardForUser(Long restaurantId, User user) {
        Account account = accountRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        Restaurant restaurant = restaurantRepository.findAllByAccount(account)
                .stream()
                .filter(r -> r.getId().equals(restaurantId))
                .findFirst()
                .orElseThrow(() -> new AccessDeniedException("You do not have access to this restaurant"));

        Dashboard dashboard = restaurant.getDashboard();

        if (dashboard == null) {
            throw new ResourceNotFoundException("Dashboard not configured for this restaurant");
        }

        return dashboardMapper.mapTo(dashboard);
    }

    @Override
    @Transactional
    public Dashboard initializeDashboard(Restaurant restaurant) {
        Dashboard dashboard = Dashboard.builder().restaurant(restaurant).build();
        dashboard = dashboardRepository.save(dashboard);

        UserRole adminRole = userRoleRepository.findByName("ROLE_ADMIN")
                .orElseThrow(() -> new RuntimeException("Error: Role not found in database"));

        // 3. Crear la página (ya puede referenciar al dashboard persistido)
        DashboardPage reservasPage = createPage("Reservas", "bookings", "", dashboard, null);
        DashboardPage savedReservasPage = dashboardPageRepository.save(reservasPage);

        // 4. Crear y guardar el widget vinculado a la página guardada
        Widget savedReservasWidget = widgetService.createWidgetIfNotFound(
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
                        """
        );
        savedReservasPage.setTabs(createPageTabs("""
                [{"name": "Historial","path": "history"},{"name": "Estadísticas","path": "stats"}]
                """));
        savedReservasPage.setWidgets(new ArrayList<>(List.of(savedReservasWidget)));
        dashboardPageRepository.save(savedReservasPage);

        List<DashboardPage> pages = new ArrayList<>(List.of(
                createPage("Inicio", "", "", dashboard, List.of()),
                savedReservasPage,
                createPage("Pedidos", "orders", "", dashboard, List.of()),
                createPage("Restaurante", "restaurant", "", dashboard, List.of()),
                createPage("Menú", "menu", "", dashboard, List.of()),
                createPage("Plantilla", "staff", "", dashboard, List.of())
        ));
        dashboard.setPages(pages);

        // Establecer y guardar el restaurante con el nuevo dashboard
        restaurant.setDashboard(dashboard);
        restaurantRepository.save(restaurant);

        System.out.println(dashboard);
        return dashboardRepository.save(dashboard);
    }

    private DashboardPage createPage(String title, String slug, String tabs, Dashboard dashboard, List<Widget> widgets) {
        try {
            return DashboardPage.builder()
                    .title(title)
                    .slug(slug)
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

package org.canay.backend.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.dto.DashboardDTO;
import org.canay.backend.domain.entity.*;
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
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage(
                        "not-found.account", null,
                        LocaleContextHolder.getLocale()
                )));

        Restaurant restaurant = restaurantRepository.findAllByAccount(account)
                .stream()
                .filter(r -> r.getId().equals(restaurantId))
                .findFirst()
                .orElseThrow(() -> new AccessDeniedException(messageSource.getMessage(
                        "access-denied",
                        new String[]{messageSource.getMessage(
                                "http.get", null,
                                LocaleContextHolder.getLocale()
                        )},
                        LocaleContextHolder.getLocale()
                )));

        Dashboard dashboard = restaurant.getDashboard();

        if (dashboard == null) {
            throw new ResourceNotFoundException(messageSource.getMessage(
                    "not-found.dashboard", null,
                    LocaleContextHolder.getLocale()
            ));
        }

        return dashboardMapper.mapTo(dashboard);
    }

    @Override
    @Transactional
    public void initializeDashboard(Restaurant restaurant, UserRole role) {
        Dashboard dashboard = Dashboard.builder().restaurant(restaurant).build();
        Dashboard savedDashboard = dashboardRepository.save(dashboard);
        restaurant.setDashboard(savedDashboard);

        // Crear las páginas
        DashboardPage homePage = createPage("Inicio", "", "", 1, savedDashboard, null);
        homePage.setTabs(createPageTabs("""
                [{"name": "","path": ""}]
                """));
        DashboardPage savedHomePage = dashboardPageRepository.save(homePage);

        DashboardPage bookingPage = createPage("Reservas", "bookings", "", 2, savedDashboard, null);
        bookingPage.setTabs(createPageTabs("""
                [{"name": "","path": ""},{"name": "Historial","path": "history"},{"name": "Estadísticas","path": "stats"}]
                """));
        DashboardPage savedBookingPage = dashboardPageRepository.save(bookingPage);
        savedBookingPage.setWidgets(createBookingWidgets(savedBookingPage, role));

        DashboardPage orderPage = createPage("Pedidos", "orders", "", 3, savedDashboard, null);
        orderPage.setTabs(createPageTabs("""
                [{"name": "","path": ""},{"name": "Historial","path": "history"},{"name": "Estadísticas","path": "stats"}]
                """));
        DashboardPage savedOrderPage = dashboardPageRepository.save(orderPage);
        savedOrderPage.setWidgets(createOrderWidgets(savedOrderPage, role));

        DashboardPage restaurantPage = createPage("Restaurante", "restaurant", "", 4, savedDashboard, null);
        restaurantPage.setTabs(createPageTabs("""
                [{"name": "Horario","path": ""}]
                """));
        DashboardPage savedRestaurantPage = dashboardPageRepository.save(restaurantPage);
        savedRestaurantPage.setWidgets(createRestaurantWidgets(savedRestaurantPage, role));

        DashboardPage menuPage = createPage("Menú", "menu", "", 5, savedDashboard, null);
        menuPage.setTabs(createPageTabs("""
                [{"name": "Products","path": ""}, {"name": "Estadísticas","path": "stats"}]
                """));
        DashboardPage savedMenuPage = dashboardPageRepository.save(menuPage);
        savedMenuPage.setWidgets(createMenuWidgets(savedMenuPage, role));

        DashboardPage staffPage = createPage("Plantilla", "staff", "", 6, savedDashboard, null);
        staffPage.setTabs(createPageTabs("""
                [{"name": "Gestionar","path": ""}]
                """));
        DashboardPage savedStaffPage = dashboardPageRepository.save(staffPage);
        savedStaffPage.setWidgets(createStaffWidgets(savedStaffPage, role));

        // Agrupar y ordenar las páginas
        List<DashboardPage> pages = new ArrayList<>(List.of(
                savedHomePage,
                savedBookingPage,
                savedOrderPage,
                savedRestaurantPage,
                savedMenuPage,
                savedStaffPage
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

    private List<Widget> createBookingWidgets(DashboardPage page, UserRole role) {
        UserRole adminRole = userRoleRepository.findByName("ROLE_ADMIN")
                .orElseThrow(() -> new RuntimeException("not-found.user.role"));

        UserRole ownerRole = userRoleRepository.findByName("ROLE_OWNER")
                .orElseThrow(() -> new ResourceNotFoundException("not-found.user.role"));

        List<Widget> widgets = new ArrayList<>();

        Optional<Widget> wBookingCrud = widgetService.createWidgetIfNotFound(
                WidgetType.CRUD_MANAGER,
                page,
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
        wBookingCrud.ifPresent(widgets::add);

        Optional<Widget> wBookingGeneral = widgetService.createWidgetIfNotFound(
                WidgetType.BOOKING_GENERAL_SUMMARY,
                page,
                Set.of(adminRole, ownerRole),
                """
                        {
                            "lg": {"x": 1,"y": 0,"w": 1,"h": 1},
                            "md": {"x": 1,"y": 0,"w": 1,"h": 1},
                            "sm": {"x": 1,"y": 0,"w": 1,"h": 1},
                            "xs": {"x": 1,"y": 0,"w": 1,"h": 1}
                        }
                        """,
                role
        );
        wBookingGeneral.ifPresent(widgets::add);

        Optional<Widget> wBookingLast = widgetService.createWidgetIfNotFound(
                WidgetType.BOOKING_LAST,
                page,
                Set.of(adminRole, ownerRole),
                """
                        {
                            "lg": {"x": 2,"y": 0,"w": 1,"h": 2},
                            "md": {"x": 2,"y": 0,"w": 1,"h": 2},
                            "sm": {"x": 2,"y": 0,"w": 1,"h": 2},
                            "xs": {"x": 2,"y": 0,"w": 1,"h": 2}
                        }
                        """,
                role
        );
        wBookingLast.ifPresent(widgets::add);

        Optional<Widget> wBookingToday = widgetService.createWidgetIfNotFound(
                WidgetType.BOOKING_TODAY,
                page,
                Set.of(adminRole, ownerRole),
                """
                        {
                            "lg": {"x": 0,"y": 0,"w": 2,"h": 1, "minW": 2},
                            "md": {"x": 0,"y": 0,"w": 2,"h": 1, "minW": 2},
                            "sm": {"x": 0,"y": 0,"w": 2,"h": 1, "minW": 2},
                            "xs": {"x": 0,"y": 0,"w": 2,"h": 1, "minW": 2}
                        }
                        """,
                role
        );
        wBookingToday.ifPresent(widgets::add);

        return widgets;
    }

    private List<Widget> createOrderWidgets(DashboardPage page, UserRole role) {
        UserRole adminRole = userRoleRepository.findByName("ROLE_ADMIN")
                .orElseThrow(() -> new RuntimeException("not-found.user.role"));

        UserRole ownerRole = userRoleRepository.findByName("ROLE_OWNER")
                .orElseThrow(() -> new ResourceNotFoundException("not-found.user.role"));

        List<Widget> widgets = new ArrayList<>();

        Optional<Widget> wOrderCrud = widgetService.createWidgetIfNotFound(
                WidgetType.CRUD_MANAGER,
                page,
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
        wOrderCrud.ifPresent(widgets::add);

        Optional<Widget> wOrderGeneral = widgetService.createWidgetIfNotFound(
                WidgetType.ORDER_GENERAL_SUMMARY,
                page,
                Set.of(adminRole, ownerRole),
                """
                        {
                            "lg": {"x": 1,"y": 0,"w": 1,"h": 1},
                            "md": {"x": 1,"y": 0,"w": 1,"h": 1},
                            "sm": {"x": 1,"y": 0,"w": 1,"h": 1},
                            "xs": {"x": 1,"y": 0,"w": 1,"h": 1}
                        }
                        """,
                role
        );
        wOrderGeneral.ifPresent(widgets::add);

        Optional<Widget> wOrderBest = widgetService.createWidgetIfNotFound(
                WidgetType.ORDER_BEST_SELLING,
                page,
                Set.of(adminRole, ownerRole),
                """
                        {
                            "lg": {"x": 1,"y": 1,"w": 1,"h": 1},
                            "md": {"x": 1,"y": 1,"w": 1,"h": 1},
                            "sm": {"x": 1,"y": 1,"w": 1,"h": 1},
                            "xs": {"x": 1,"y": 1,"w": 1,"h": 1}
                        }
                        """,
                role
        );
        wOrderBest.ifPresent(widgets::add);

        Optional<Widget> wOrderLast = widgetService.createWidgetIfNotFound(
                WidgetType.ORDER_LAST,
                page,
                Set.of(adminRole, ownerRole),
                """
                        {
                            "lg": {"x": 2,"y": 0,"w": 1,"h": 2},
                            "md": {"x": 2,"y": 0,"w": 1,"h": 2},
                            "sm": {"x": 2,"y": 0,"w": 1,"h": 2},
                            "xs": {"x": 2,"y": 0,"w": 1,"h": 2}
                        }
                        """,
                role
        );
        wOrderLast.ifPresent(widgets::add);

        Optional<Widget> wOrderSales = widgetService.createWidgetIfNotFound(
                WidgetType.ORDER_SALES_PERFORMANCE,
                page,
                Set.of(adminRole, ownerRole),
                """
                        {
                            "lg": {"x": 0,"y": 1,"w": 1,"h": 1},
                            "md": {"x": 0,"y": 1,"w": 1,"h": 1},
                            "sm": {"x": 0,"y": 1,"w": 1,"h": 1},
                            "xs": {"x": 0,"y": 1,"w": 1,"h": 1}
                        }
                        """,
                role
        );
        wOrderSales.ifPresent(widgets::add);

        return widgets;
    }

    private List<Widget> createMenuWidgets(DashboardPage page, UserRole role) {
        UserRole adminRole = userRoleRepository.findByName("ROLE_ADMIN")
                .orElseThrow(() -> new RuntimeException("not-found.user.role"));

        UserRole ownerRole = userRoleRepository.findByName("ROLE_OWNER")
                .orElseThrow(() -> new ResourceNotFoundException("not-found.user.role"));

        List<Widget> widgets = new ArrayList<>();

        Optional<Widget> wOrderCrud = widgetService.createWidgetIfNotFound(
                WidgetType.CRUD_MANAGER,
                page,
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
        wOrderCrud.ifPresent(widgets::add);

        return widgets;
    }

    private List<Widget> createRestaurantWidgets(DashboardPage page, UserRole role) {
        UserRole adminRole = userRoleRepository.findByName("ROLE_ADMIN")
                .orElseThrow(() -> new RuntimeException("not-found.user.role"));

        UserRole ownerRole = userRoleRepository.findByName("ROLE_OWNER")
                .orElseThrow(() -> new ResourceNotFoundException("not-found.user.role"));

        List<Widget> widgets = new ArrayList<>();

        Optional<Widget> wOrderCrud = widgetService.createWidgetIfNotFound(
                WidgetType.CRUD_MANAGER,
                page,
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
        wOrderCrud.ifPresent(widgets::add);

        return widgets;
    }

    private List<Widget> createStaffWidgets(DashboardPage page, UserRole role) {
        UserRole adminRole = userRoleRepository.findByName("ROLE_ADMIN")
                .orElseThrow(() -> new RuntimeException("not-found.user.role"));

        UserRole ownerRole = userRoleRepository.findByName("ROLE_OWNER")
                .orElseThrow(() -> new ResourceNotFoundException("not-found.user.role"));

        List<Widget> widgets = new ArrayList<>();

        Optional<Widget> wOrderCrud = widgetService.createWidgetIfNotFound(
                WidgetType.CRUD_MANAGER,
                page,
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
        wOrderCrud.ifPresent(widgets::add);

        return widgets;
    }
}
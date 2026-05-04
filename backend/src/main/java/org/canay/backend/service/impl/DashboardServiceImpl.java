package org.canay.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.dto.DashboardDTO;
import org.canay.backend.domain.entities.*;
import org.canay.backend.exceptions.ResourceNotFoundException;
import org.canay.backend.mappers.Mapper;
import org.canay.backend.repository.*;
import org.canay.backend.service.DashboardService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {
    private final AccountRepository accountRepository;
    private final RestaurantRepository restaurantRepository;
    private final DashboardRepository dashboardRepository;

    private final Mapper<Dashboard, DashboardDTO> dashboardMapper;

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

        System.out.println(dashboardMapper.mapTo(dashboard));

        return dashboardMapper.mapTo(dashboard);
    }

    @Override
    public Dashboard initializeDashboard(Restaurant restaurant) {
        Dashboard dashboard = Dashboard.builder().restaurant(restaurant).build();

        List<DashboardPage> pages = List.of(
                createPage("Inicio", "", dashboard),
                createPage("Reservas", "bookings", dashboard),
                createPage("Pedidos", "orders", dashboard),
                createPage("Restaurante", "restaurant", dashboard),
                createPage("Menú", "menu", dashboard),
                createPage("Plantilla", "staff", dashboard)
        );
        dashboard.setPages(pages);

        // Establecer y guardar el restaurante con el nuevo dashboard
        restaurant.setDashboard(dashboard);
        restaurantRepository.save(restaurant);

        return dashboardRepository.save(dashboard);
    }

    private DashboardPage createPage(String title, String slug, Dashboard dashboard) {
        return DashboardPage.builder()
                .title(title)
                .slug(slug)
                .tabs(null)
                .dashboard(dashboard)
                .widgets(null)
                .build();
    }
}

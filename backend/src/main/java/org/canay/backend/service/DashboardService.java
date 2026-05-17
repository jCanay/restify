package org.canay.backend.service;

import org.canay.backend.domain.dto.DashboardDTO;
import org.canay.backend.domain.entities.Restaurant;
import org.canay.backend.domain.entities.User;
import org.canay.backend.domain.entities.UserRole;

public interface DashboardService {
    DashboardDTO getDashboardForUser(Long restaurantId, User user);

    void initializeDashboard(Restaurant restaurant, UserRole role);
}

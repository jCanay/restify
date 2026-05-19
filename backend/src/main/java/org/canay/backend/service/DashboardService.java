package org.canay.backend.service;

import org.canay.backend.domain.dto.DashboardDTO;
import org.canay.backend.domain.entity.Restaurant;
import org.canay.backend.domain.entity.User;
import org.canay.backend.domain.entity.UserRole;

public interface DashboardService {
    DashboardDTO getDashboardForUser(Long restaurantId, User user);

    void initializeDashboard(Restaurant restaurant, UserRole role);
}

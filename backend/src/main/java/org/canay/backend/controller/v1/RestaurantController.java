package org.canay.backend.controller.v1;

import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.dto.BookingDTO;
import org.canay.backend.domain.dto.DashboardDTO;
import org.canay.backend.domain.dto.RestaurantDTO;
import org.canay.backend.domain.entities.User;
import org.canay.backend.service.BookingService;
import org.canay.backend.service.DashboardService;
import org.canay.backend.service.RestaurantService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/restaurants")
@RequiredArgsConstructor
public class RestaurantController {
    private final RestaurantService restaurantService;
    private final DashboardService dashboardService;
    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<RestaurantDTO> addRestaurant(
            @RequestBody RestaurantDTO restaurantDTO,
            @AuthenticationPrincipal User user
    ) {
        return new ResponseEntity<>(restaurantService.addRestaurant(restaurantDTO, user), HttpStatus.CREATED);
    }

    @GetMapping("/{restaurantId}/dashboards")
    public ResponseEntity<DashboardDTO> getDashboardByRestaurantId(
            @PathVariable Long restaurantId,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(dashboardService.getDashboardForUser(restaurantId, user));
    }


    @PostMapping("/{restaurantId}/bookings")
    public ResponseEntity<BookingDTO> addBookingToRestaurant(
            @RequestBody BookingDTO bookingDTO,
            @PathVariable Long restaurantId,
            @AuthenticationPrincipal User user
    ) {
        return new ResponseEntity<>(bookingService.create(bookingDTO, restaurantId, user), HttpStatus.CREATED);
    }
}

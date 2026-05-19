package org.canay.backend.controller.v1;

import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.dto.BookingDTO;
import org.canay.backend.domain.dto.DashboardDTO;
import org.canay.backend.domain.dto.LocationStatusDTO;
import org.canay.backend.domain.dto.RestaurantDTO;
import org.canay.backend.domain.entity.User;
import org.canay.backend.service.BookingService;
import org.canay.backend.service.DashboardService;
import org.canay.backend.service.RestaurantService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/restaurants")
@RequiredArgsConstructor
public class RestaurantController {
    private final RestaurantService restaurantService;
    private final DashboardService dashboardService;
    private final BookingService bookingService;

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER')")
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

    @PreAuthorize("hasAnyRole('ADMIN')")
    @PostMapping("/{restaurantId}/bookings")
    public ResponseEntity<BookingDTO> addBookingToRestaurant(
            @RequestBody BookingDTO bookingDTO,
            @PathVariable Long restaurantId,
            @AuthenticationPrincipal User user
    ) {
        return new ResponseEntity<>(bookingService.create(bookingDTO, restaurantId, user), HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'WAITER', 'COOK')")
    @GetMapping("/{restaurantId}/bookings")
    public ResponseEntity<Page<BookingDTO>> getAllBookingsByRestaurantId(
            @PathVariable Long restaurantId,
            Pageable pageable,
            @AuthenticationPrincipal User user
    ) {
        return new ResponseEntity<>(bookingService.getAllByRestaurantId(restaurantId, pageable, user), HttpStatus.OK);
    }

    @GetMapping("/locations/{countryCode}/status")
    public ResponseEntity<LocationStatusDTO> checkLocationStatus(
            @PathVariable String countryCode,
            @RequestParam(required = false) String city,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(restaurantService.checkLocationStatus(countryCode, city, user));
    }

    @GetMapping
    public ResponseEntity<Page<RestaurantDTO>> getRestaurants(
            @RequestParam(required = false) String countryCode,
            @RequestParam(required = false) String city,
            Pageable pageable,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(restaurantService.getRestaurants(countryCode, city, pageable, user));
    }
}

package org.canay.backend.controller.v1;

import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.dto.*;
import org.canay.backend.domain.entity.User;
import org.canay.backend.service.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/restaurants")
@RequiredArgsConstructor
public class RestaurantController {
    private final RestaurantService restaurantService;
    private final DashboardService dashboardService;
    private final BookingService bookingService;
    private final OrderService orderService;
    private final ProductService productService;

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

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{restaurantId}/orders")
    public ResponseEntity<OrderDTO> addOrderToRestaurant(
            @RequestBody OrderDTO orderDTO,
            @PathVariable Long restaurantId,
            @RequestParam Long addressId,
            @AuthenticationPrincipal User user
    ) {
        return new ResponseEntity<>(orderService.create(orderDTO, restaurantId, addressId, user), HttpStatus.CREATED);
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

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'WAITER', 'COOK')")
    @GetMapping("/{restaurantId}/orders")
    public ResponseEntity<Page<OrderDTO>> getAllOrdersByRestaurantId(
            @PathVariable Long restaurantId,
            Pageable pageable,
            @AuthenticationPrincipal User user
    ) {
        return new ResponseEntity<>(orderService.getAllByRestaurantId(restaurantId, pageable, user), HttpStatus.OK);
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

    @GetMapping("/search")
    public ResponseEntity<RestaurantDetailDTO> getRestaurants(
            @RequestParam String countryCode,
            @RequestParam String city,
            @RequestParam String slug,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(restaurantService.getRestaurantDetail(countryCode, city, slug, user));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'WAITER', 'COOK')")
    @GetMapping("/{restaurantId}")
    public ResponseEntity<RestaurantDTO> getRestaurant(
            @PathVariable Long restaurantId,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(restaurantService.getRestaurant(restaurantId, user));
    }

    @GetMapping("/nearby")
    public ResponseEntity<NearbyRestaurantsResponseDTO> findNearbyRestaurants(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            Pageable pageable,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(restaurantService.findNearbyRestaurants(latitude, longitude, pageable, user));
    }

    @GetMapping("/{restaurantId}/products")
    public ResponseEntity<List<ProductDTO>> getProductsByRestaurantId(
            @PathVariable Long restaurantId,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(productService.getProductsByRestaurant(restaurantId, user));
    }
}

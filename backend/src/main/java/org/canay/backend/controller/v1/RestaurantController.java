package org.canay.backend.controller.v1;

import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.dto.RestaurantDTO;
import org.canay.backend.domain.entities.User;
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

    @PostMapping
    public ResponseEntity<RestaurantDTO> addRestaurant(@RequestBody RestaurantDTO restaurantDTO, @AuthenticationPrincipal User user) {
        System.out.println("Entrado al controlador de restaurantes");
        return new ResponseEntity<>(restaurantService.addRestaurant(restaurantDTO, user), HttpStatus.CREATED);
    }
}

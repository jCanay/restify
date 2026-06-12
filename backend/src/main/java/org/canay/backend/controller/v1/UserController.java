package org.canay.backend.controller.v1;

import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.dto.OrderDTO;
import org.canay.backend.domain.dto.UserDTO;
import org.canay.backend.domain.entity.User;
import org.canay.backend.service.OrderService;
import org.canay.backend.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final OrderService orderService;

    @GetMapping("/orders")
    public ResponseEntity<Page<OrderDTO>> getOrdersByUser(Pageable pageable, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.getAllByUser(pageable, user));
    }
}

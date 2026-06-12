package org.canay.backend.service;

import org.canay.backend.domain.dto.OrderDTO;
import org.canay.backend.domain.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderService {
    OrderDTO create(OrderDTO orderDTO, Long restaurantId, Long addressId, User user);

    Page<OrderDTO> getAllByRestaurantId(Long restaurantId, Pageable pageable, User user);

    Page<OrderDTO> getAllByUser(Pageable pageable, User user);
}

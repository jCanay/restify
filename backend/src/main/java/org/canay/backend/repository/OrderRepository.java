package org.canay.backend.repository;

import org.canay.backend.domain.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findAllByRestaurantId(Long restaurantId, Pageable pageable);

    Page<Order> findAllByAccountId(Long accountId, Pageable pageable);
}

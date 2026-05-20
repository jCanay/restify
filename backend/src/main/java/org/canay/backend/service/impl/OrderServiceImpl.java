package org.canay.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.dto.OrderDTO;
import org.canay.backend.domain.entity.Account;
import org.canay.backend.domain.entity.Order;
import org.canay.backend.domain.entity.Restaurant;
import org.canay.backend.domain.entity.User;
import org.canay.backend.exception.ResourceNotFoundException;
import org.canay.backend.mapper.Mapper;
import org.canay.backend.repository.AccountRepository;
import org.canay.backend.repository.OrderRepository;
import org.canay.backend.repository.RestaurantRepository;
import org.canay.backend.service.OrderService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final RestaurantRepository restaurantRepository;
    private final AccountRepository accountRepository;
    private final OrderRepository orderRepository;

    private final Mapper<Order, OrderDTO> orderMapper;

    @Override
    public OrderDTO create(OrderDTO orderDTO, Long restaurantId, User user) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("not-found.restaurant"));

        Account account = accountRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("not-found.account"));

        Order orderEntity = orderMapper.mapFrom(orderDTO);

        orderEntity.setAccount(account);
        orderEntity.setRestaurant(restaurant);

        Order savedOrderEntity = orderRepository.save(orderEntity);

        return orderMapper.mapTo(savedOrderEntity);
    }

    @Override
    public Page<OrderDTO> getAllByRestaurantId(Long restaurantId, Pageable pageable, User user) {
        return orderRepository.findAllByRestaurantId(restaurantId, pageable).map(orderMapper::mapTo);
    }
}

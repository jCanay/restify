package org.canay.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.dto.OrderDTO;
import org.canay.backend.domain.dto.PaymentDTO;
import org.canay.backend.domain.dto.UserDTO;
import org.canay.backend.domain.entity.*;
import org.canay.backend.exception.ResourceNotFoundException;
import org.canay.backend.mapper.Mapper;
import org.canay.backend.repository.AccountRepository;
import org.canay.backend.repository.AddressRepository;
import org.canay.backend.repository.OrderRepository;
import org.canay.backend.repository.RestaurantRepository;
import org.canay.backend.service.OrderService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final RestaurantRepository restaurantRepository;
    private final AccountRepository accountRepository;
    private final AddressRepository addressRepository;
    private final OrderRepository orderRepository;

    private final Mapper<Order, OrderDTO> orderMapper;
    private final Mapper<User, UserDTO> userMapper;
    private final Mapper<Payment, PaymentDTO> paymentMapper;

    @Override
    public OrderDTO create(OrderDTO orderDTO, Long restaurantId, Long addressId, User user) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("not-found.restaurant"));

        Account account = accountRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("not-found.account"));

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("not-found-address"));

        Order orderEntity = orderMapper.mapFrom(orderDTO);

        orderEntity.setAccount(account);
        orderEntity.setRestaurant(restaurant);
        orderEntity.setAddress(address);

        System.out.println(orderDTO);

        if (orderEntity.getItems() != null) {
            orderEntity.getItems().forEach(item -> item.setOrder(orderEntity));
        }

        System.out.println(orderEntity);

        Order savedOrderEntity = orderRepository.save(orderEntity);

        return orderMapper.mapTo(savedOrderEntity);
    }

    @Override
    public Page<OrderDTO> getAllByRestaurantId(Long restaurantId, Pageable pageable, User user) {
        return orderRepository.findAllByRestaurantId(restaurantId, pageable).map((order -> {
            OrderDTO orderDTO = orderMapper.mapTo(order);
            orderDTO.setUser(userMapper.mapTo(order.getAccount().getUser()));
            return orderDTO;
        }));
    }
}

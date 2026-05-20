package org.canay.backend.mapper.impl;

import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.dto.OrderDTO;
import org.canay.backend.domain.entity.Order;
import org.canay.backend.mapper.Mapper;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OrderMapper implements Mapper<Order, OrderDTO> {
    private final ModelMapper modelMapper;

    @Override
    public OrderDTO mapTo(Order order) {
        return modelMapper.map(order, OrderDTO.class);
    }

    @Override
    public Order mapFrom(OrderDTO orderDTO) {
        return modelMapper.map(orderDTO, Order.class);
    }
}

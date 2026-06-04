package org.canay.backend.mapper.impl;

import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.dto.OrderItemDTO;
import org.canay.backend.domain.entity.OrderItem;
import org.canay.backend.mapper.Mapper;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OrderItemMapper implements Mapper<OrderItem, OrderItemDTO> {
    private final ModelMapper modelMapper;

    @Override
    public OrderItemDTO mapTo(OrderItem orderItem) {
        return modelMapper.map(orderItem, OrderItemDTO.class);
    }

    @Override
    public OrderItem mapFrom(OrderItemDTO orderItemDTO) {
        return modelMapper.map(orderItemDTO, OrderItem.class);
    }
}

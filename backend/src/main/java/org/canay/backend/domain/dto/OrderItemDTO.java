package org.canay.backend.domain.dto;

import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record OrderItemDTO(
        Long id,
        String name,
        BigDecimal price,
        Integer quantity
) {}

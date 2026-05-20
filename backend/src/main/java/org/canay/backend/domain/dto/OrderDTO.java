package org.canay.backend.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;

import java.time.Instant;
import java.util.List;

@Builder
public record OrderDTO(
        Long id,
        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        String status,
        List<OrderItemDTO> items,
        RestaurantDTO restaurant,
        AccountDTO account,
        PaymentDTO payment,
        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        Instant createdAt,
        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        Instant updatedAt
) {}
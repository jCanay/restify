package org.canay.backend.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;

import java.util.List;

@Builder
public record OrderRequestDTO(
        Long id,
        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        String status,
        List<OrderItemDTO> items,
        AddressDTO address,
        Long restaurantId,
        Long accountId,
        PaymentDTO payment
) {}
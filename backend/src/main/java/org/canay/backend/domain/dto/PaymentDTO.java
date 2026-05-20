package org.canay.backend.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.Instant;

@Builder
public record PaymentDTO(
        Long id,
        BigDecimal amount,
        String method,
        String status,
        String transactionId,
        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        Instant createdAt,
        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        Instant updatedAt
) {}

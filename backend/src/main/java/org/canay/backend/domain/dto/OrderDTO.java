package org.canay.backend.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderDTO {
    private Long id;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String status;
    private String notes;
    private List<OrderItemDTO> items;
    private RestaurantDTO restaurant;
    private AccountDTO account;
    private PaymentDTO payment;
    private AddressDTO address;
    private UserDTO user;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Instant createdAt;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Instant updatedAt;
}


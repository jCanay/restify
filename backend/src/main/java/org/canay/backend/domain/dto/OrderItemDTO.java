package org.canay.backend.domain.dto;

import lombok.*;

import java.math.BigDecimal;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class OrderItemDTO {
    private Long id;
    private String name;
    private BigDecimal price;
    private Integer quantity;
}

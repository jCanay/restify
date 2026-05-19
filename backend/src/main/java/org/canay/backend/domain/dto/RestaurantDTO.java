package org.canay.backend.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantDTO {
    private Long id;
    private String name;
    private Double deliveryRadius;
    private AddressDTO address;

    @Builder.Default
    private Boolean isDefault = false;
    //    private Dashboard dashboard;
}

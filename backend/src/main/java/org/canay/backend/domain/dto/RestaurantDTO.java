package org.canay.backend.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantDTO {
    private Long id;
    private String name;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String slug;
    private BigDecimal shippingCosts;
    private Double deliveryRadiusMeters;
    private AddressDTO address;

    @Builder.Default
    private Boolean isDefault = false;
    //    private Dashboard dashboard;
}

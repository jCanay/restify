package org.canay.backend.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.canay.backend.domain.entities.Address;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantDTO {
    private Long id;
    private String name;
    private Double deliveryRadius;
    private List<AddressDTO> addresses;
    
    @Builder.Default
    private Boolean isDefault = false;
    //    private Dashboard dashboard;
}

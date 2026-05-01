package org.canay.backend.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AddressDTO {
    private String label;
    private String streetAddress;
    private String city;
    private String country;
    private String zipCode;
    private String floor;
    private Double latitude;
    private Double longitude;
    private String notes;
    private Boolean isDefault = false;
}

package org.canay.backend.domain.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "addresses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String label;

    @Column(name = "street_address")
    private String streetAddress;

    private String city;

    private String country;

    private String zipCode;

    private String floor;

    private Double latitude;

    private Double longitude;

    private String notes;

    private Boolean isDefault = false;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;

    @ManyToOne
    @JoinColumn(name = "restaurant_id")
    private Restaurant restaurant;

    @PrePersist
    @PreUpdate
    private void validateOwner() {
        if ((account == null && restaurant == null) || (account != null && restaurant != null)) {
            throw new IllegalStateException("La dirección debe pertenecer exactamente a una Cuenta o a un Restaurante");
        }
    }
}

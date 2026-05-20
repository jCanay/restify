package org.canay.backend.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;

import java.time.ZoneId;

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

    private String countryCode;

    private String zipCode;

    private String floor;

    private Double latitude;

    private Double longitude;

    @Column(columnDefinition = "POINT SRID 4326")
    private Point location;

    private ZoneId zoneId;

    private String notes;

    @Builder.Default
    private Boolean isDefault = false;

    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;

    @ToString.Exclude
    @OneToOne
    @JoinColumn(name = "restaurant_id")
    private Restaurant restaurant;

    @PrePersist
    @PreUpdate
    private void validateOwner() {
        if ((account == null && restaurant == null) || (account != null && restaurant != null)) {
            throw new IllegalStateException("La dirección debe pertenecer exactamente a una Cuenta o a un Restaurante");
        }

        GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
        this.location = geometryFactory.createPoint(new Coordinate(longitude, latitude));
    }
}

package org.canay.backend.domain.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "restaurants")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Restaurant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String direction;

    private String city;

    private Double latitude;

    private Double longitude;

    @Column(name = "delivery_radius")
    private Double deliveryRadius;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;

    @OneToOne(mappedBy = "restaurant", cascade = CascadeType.ALL)
    private Dashboard dashboard;
}

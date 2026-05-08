package org.canay.backend.domain.entities;

import jakarta.persistence.*;
import lombok.*;

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

    @Builder.Default
    private Boolean isDefault = false;

    @Column(name = "delivery_radius")
    private Double deliveryRadius;

    @OneToOne(mappedBy = "restaurant", cascade = CascadeType.ALL)
    private Address address;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "dashboard_id")
    private Dashboard dashboard;
}

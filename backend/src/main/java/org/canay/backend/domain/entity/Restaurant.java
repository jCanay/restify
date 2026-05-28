package org.canay.backend.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

import static org.canay.backend.util.StringFormatter.normalizeStringUrl;

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

    private String slug;

    private BigDecimal shippingCosts;

    @Builder.Default
    private Boolean isDefault = false;

    @Column(name = "delivery_radius_meters")
    private Double deliveryRadiusMeters;

    @OneToOne(mappedBy = "restaurant", cascade = CascadeType.ALL)
    private Address address;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "dashboard_id")
    private Dashboard dashboard;

    @PreUpdate
    protected void onCreate() {
        if (this.name != null) {
            this.slug = normalizeStringUrl(this.name)
                    .concat("-")
                    .concat(normalizeStringUrl(this.address.getCity()));
        }
    }
}

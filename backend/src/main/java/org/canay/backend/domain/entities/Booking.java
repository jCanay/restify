package org.canay.backend.domain.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZonedDateTime;

@Entity
@Table(name = "bookings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    private LocalDateTime bookingDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private BookingStatus status = BookingStatus.PENDING;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(nullable = false, name = "restaurant_id")
    private Restaurant restaurant;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
    }
}

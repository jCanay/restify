package org.canay.backend.repository;

import org.canay.backend.domain.entity.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    Page<Booking> findAllByRestaurantId(Long restaurantId, Pageable pageable);
}

package org.canay.backend.repository;

import org.canay.backend.domain.entities.Restaurant;
import org.canay.backend.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    @Query(value = "SELECT * FROM restaurants r WHERE " +
            "(6371 * acos(cos(radians(:latitude)) * cos(radians(r.latitude)) * " +
            "cos(radians(r.longitude) - radians(:longitude)) + " +
            "sin(radians(:latitude)) * sin(radians(r.latitude)))) <= r.delivery_radius",
            nativeQuery = true)
    List<Restaurant> findNearbyRestaurants(@Param("latitude") Double latitude,
                                           @Param("longitude") Double longitude);
}

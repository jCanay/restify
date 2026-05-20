package org.canay.backend.repository;

import org.canay.backend.domain.entity.Account;
import org.canay.backend.domain.entity.Restaurant;
import org.locationtech.jts.geom.Point;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    List<Restaurant> findAllByAccount(Account account);

    Long countByAccount(Account account);

    Boolean existsByAddressCountryCodeIgnoreCase(String countryCode);

    Boolean existsByAddressCountryCodeIgnoreCaseAndAddressCityIgnoreCase(String countryCode, String city);

    Long countByAddressCountryCodeIgnoreCase(String countryCode);

    Long countByAddressCountryCodeIgnoreCaseAndAddressCityIgnoreCase(String countryCode, String city);

    Page<Restaurant> findByAddressCountryCodeIgnoreCaseAndAddressCityIgnoreCase(
            String countryCode,
            String city,
            Pageable pageable
    );

    Page<Restaurant> findByAddressCountryCodeIgnoreCase(
            String countryCode,
            Pageable pageable
    );

    @Query(value = "SELECT r.* FROM restaurants r " +
            "JOIN addresses a ON a.restaurant_id = r.id " +
            "WHERE ST_Distance_Sphere(a.location, :userLocation) <= r.delivery_radius_meters",
            countQuery = "SELECT count(*) FROM restaurants r " +
                    "JOIN addresses a ON a.restaurant_id = r.id " +
                    "WHERE ST_Distance_Sphere(a.location, :userLocation) <= r.delivery_radius_meters",
            nativeQuery = true)
    Page<Restaurant> findNearbyRestaurants(@Param("userLocation") Point userLocation, Pageable pageable);
}

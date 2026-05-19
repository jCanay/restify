package org.canay.backend.repository;

import org.canay.backend.domain.entity.Account;
import org.canay.backend.domain.entity.Restaurant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

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
}

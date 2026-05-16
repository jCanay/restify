package org.canay.backend.repository;

import org.canay.backend.domain.entities.Account;
import org.canay.backend.domain.entities.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    List<Restaurant> findAllByAccount(Account account);

    Long countByAccount(Account account);

    Boolean existsByAddressCountryCodeIgnoreCase(String countryCode);

    Boolean existsByAddressCountryCodeIgnoreCaseAndAddressCityIgnoreCase(String countryCode, String city);

    Long countByAddressCountryCodeIgnoreCase(String countryCode);

    Long countByAddressCountryCodeIgnoreCaseAndAddressCityIgnoreCase(String countryCode, String city);
}

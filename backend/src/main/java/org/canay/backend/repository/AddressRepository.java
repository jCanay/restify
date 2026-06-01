package org.canay.backend.repository;

import org.canay.backend.domain.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findAllByAccountId(Long accountId);

}

package org.canay.backend.repository;

import org.canay.backend.domain.entity.Account;
import org.canay.backend.domain.entity.Address;
import org.canay.backend.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByUser(User user);
}

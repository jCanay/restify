package org.canay.backend.service;

import org.canay.backend.domain.dto.AccountDTO;
import org.canay.backend.domain.dto.AddressDTO;
import org.canay.backend.domain.entity.User;

import java.util.List;

public interface AccountService {
    AccountDTO completeOnboarding(User user);

    List<AddressDTO> getAllAddressesByUser(User user);
}

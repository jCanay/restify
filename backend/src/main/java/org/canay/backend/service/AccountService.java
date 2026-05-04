package org.canay.backend.service;

import org.canay.backend.domain.dto.AccountDTO;
import org.canay.backend.domain.entities.User;

public interface AccountService {
    AccountDTO completeOnboarding(User user);
}

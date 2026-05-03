package org.canay.backend.service;

import org.canay.backend.domain.dto.AccountDTO;

public interface AccountService {
    AccountDTO completeOnboarding(Long userId);
}

package org.canay.backend.service.impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.dto.AccountDTO;
import org.canay.backend.domain.entity.Account;
import org.canay.backend.domain.entity.User;
import org.canay.backend.mapper.Mapper;
import org.canay.backend.repository.AccountRepository;
import org.canay.backend.service.AccountService;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;

    private final MessageSource messageSource;

    private final Mapper<Account, AccountDTO> accountMapper;

    @Override
    @Transactional
    public AccountDTO completeOnboarding(User user) {
        // 1. Buscamos la cuenta directamente por el usuario del token
        Account account = accountRepository.findByUser(user)
                .orElseThrow(() -> new EntityNotFoundException(messageSource.getMessage("not-found.account", null,
                        LocaleContextHolder.getLocale())));

        // 2. Cambiamos el estado
        account.setOnboardingCompleted(true);

        // 3. Guardamos y retornamos el DTO
        return accountMapper.mapTo(accountRepository.save(account));
    }
}
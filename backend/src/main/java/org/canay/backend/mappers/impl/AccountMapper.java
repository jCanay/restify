package org.canay.backend.mappers.impl;

import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.dto.AccountDTO;
import org.canay.backend.domain.entities.Account;
import org.canay.backend.mappers.Mapper;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AccountMapper implements Mapper<Account, AccountDTO> {
    private final ModelMapper modelMapper;

    @Override
    public AccountDTO mapTo(Account account) {
        return modelMapper.map(account, AccountDTO.class);
    }

    @Override
    public Account mapFrom(AccountDTO accountDTO) {
        return modelMapper.map(accountDTO, Account.class);
    }
}

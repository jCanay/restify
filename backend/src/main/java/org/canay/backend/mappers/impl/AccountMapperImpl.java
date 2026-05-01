package org.canay.backend.mappers.impl;

import org.canay.backend.domain.dto.AccountDTO;
import org.canay.backend.domain.entities.Account;
import org.canay.backend.mappers.Mapper;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AccountMapperImpl implements Mapper<Account, AccountDTO> {
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public AccountDTO mapTo(Account account) {
        return modelMapper.map(account, AccountDTO.class);
    }

    @Override
    public Account mapFrom(AccountDTO accountDTO) {
        return modelMapper.map(accountDTO, Account.class);
    }
}

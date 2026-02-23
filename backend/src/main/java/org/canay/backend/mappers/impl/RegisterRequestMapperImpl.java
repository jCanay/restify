package org.canay.backend.mappers.impl;

import org.canay.backend.domain.dto.RegisterRequestDTO;
import org.canay.backend.domain.entities.User;
import org.canay.backend.mappers.Mapper;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class RegisterRequestMapperImpl implements Mapper<User, RegisterRequestDTO> {
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public RegisterRequestDTO mapTo(User user) {
        return modelMapper.map(user, RegisterRequestDTO.class);
    }

    @Override
    public User mapFrom(RegisterRequestDTO registerRequestDTO) {
        return modelMapper.map(registerRequestDTO, User.class);
    }
}

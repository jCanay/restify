package org.canay.backend.mappers.impl;

import org.canay.backend.domain.dto.UserDTO;
import org.canay.backend.domain.entities.User;
import org.canay.backend.mappers.Mapper;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserMapper implements Mapper<User, UserDTO> {
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public UserDTO mapTo(User user) {
        return modelMapper.map(user, UserDTO.class);
    }

    @Override
    public User mapFrom(UserDTO userDTO) {
        return modelMapper.map(userDTO, User.class);
    }
}

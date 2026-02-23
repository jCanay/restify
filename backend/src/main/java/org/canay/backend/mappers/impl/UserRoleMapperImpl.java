package org.canay.backend.mappers.impl;

import org.canay.backend.domain.dto.UserRoleDTO;
import org.canay.backend.domain.entities.UserRole;
import org.canay.backend.mappers.Mapper;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserRoleMapperImpl implements Mapper<UserRole, UserRoleDTO> {
    @Autowired
    private  ModelMapper modelMapper;

    @Override
    public UserRoleDTO mapTo(UserRole userRole) {
        return modelMapper.map(userRole, UserRoleDTO.class);
    }

    @Override
    public UserRole mapFrom(UserRoleDTO userRoleDTO) {
        return modelMapper.map(userRoleDTO, UserRole.class);
    }
}

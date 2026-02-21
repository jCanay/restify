package org.canay.backend.mappers.impl;

import org.canay.backend.domain.dto.UserRoleDTO;
import org.canay.backend.domain.entities.UserRole;
import org.canay.backend.mappers.Mapper;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class UserRoleMapper implements Mapper<UserRole, UserRoleDTO> {
    private final ModelMapper modelMapper;

    public UserRoleMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    @Override
    public UserRoleDTO mapTo(UserRole userRole) {
        return modelMapper.map(userRole, UserRoleDTO.class);
    }

    @Override
    public UserRole mapFrom(UserRoleDTO userRoleDTO) {
        return modelMapper.map(userRoleDTO, UserRole.class);
    }
}

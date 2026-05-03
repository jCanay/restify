package org.canay.backend.service.impl;

import org.canay.backend.domain.dto.UserDTO;
import org.canay.backend.domain.entities.User;
import org.canay.backend.mappers.Mapper;
import org.canay.backend.repository.UserRepository;
import org.canay.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private Mapper<User, UserDTO> userMapper;

    @Override
    public List<UserDTO> getUsers() {
        List<User> result = userRepository.findAll();
        return result.stream().map(user -> userMapper.mapTo(user)).toList();
    }
}

package org.canay.backend.service;

import org.canay.backend.domain.dto.UserDTO;

import java.util.List;

public interface UserService {
    List<UserDTO> getUsers();
}

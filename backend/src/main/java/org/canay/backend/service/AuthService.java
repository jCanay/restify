package org.canay.backend.service;

import org.canay.backend.domain.dto.LoginResponseDTO;
import org.canay.backend.domain.dto.RegisterResponseDTO;
import org.canay.backend.domain.dto.LoginRequestDTO;
import org.canay.backend.domain.dto.RegisterRequestDTO;

public interface AuthService {
    LoginResponseDTO login(LoginRequestDTO loginRequestDTO);
    RegisterResponseDTO register(RegisterRequestDTO registerRequestDTO);
}

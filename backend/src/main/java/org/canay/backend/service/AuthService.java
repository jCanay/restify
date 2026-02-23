package org.canay.backend.service;

import org.canay.backend.domain.dto.AuthResponseDTO;
import org.canay.backend.domain.dto.LoginRequestDTO;
import org.canay.backend.domain.dto.RegisterRequestDTO;

public interface AuthService {
    AuthResponseDTO login(LoginRequestDTO loginRequestDTO);
    AuthResponseDTO register(RegisterRequestDTO registerRequestDTO);
}

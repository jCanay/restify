package org.canay.backend.controller.v1;

import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.dto.LoginResponseDTO;
import org.canay.backend.domain.dto.RegisterResponseDTO;
import org.canay.backend.domain.dto.LoginRequestDTO;
import org.canay.backend.domain.dto.RegisterRequestDTO;
import org.canay.backend.service.AuthService;
import org.canay.backend.service.RefreshTokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final RefreshTokenService refreshTokenService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO loginRequestDTO) {
        return ResponseEntity.ok(authService.login(loginRequestDTO));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody Map<String, String> payload) {
        String requestToken = payload.get("refreshToken");

        if (requestToken == null || requestToken.isBlank()) {
            return ResponseEntity.badRequest().body("Refresh token is required.");
        }

//        return refreshTokenRepository.findByToken(requestToken)
//                .map(token -> {
//                    refreshTokenRepository.delete(token);
//                    return ResponseEntity.ok("Logged out successfully.");
//                })
//                .orElse(ResponseEntity.badRequest().body("Invalid refresh token."));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDTO> register(@RequestBody RegisterRequestDTO registerRequestDTO) {
        return ResponseEntity.ok(authService.register(registerRequestDTO));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> payload) {
        return refreshTokenService.refresh(payload);
    }
}
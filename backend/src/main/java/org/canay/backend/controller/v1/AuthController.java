package org.canay.backend.controller.v1;

import org.canay.backend.domain.dto.AuthResponseDTO;
import org.canay.backend.domain.dto.LoginRequestDTO;
import org.canay.backend.domain.dto.RegisterRequestDTO;
import org.canay.backend.service.AuthService;
import org.canay.backend.service.RefreshTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginRequestDTO loginRequestDTO) {
        return ResponseEntity.ok(authService.login(loginRequestDTO));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(@RequestBody Map<String, String> payload) {
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
    public ResponseEntity<AuthResponseDTO> register(@RequestBody RegisterRequestDTO registerRequestDTO) {
        return ResponseEntity.ok(authService.register(registerRequestDTO));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> payload) {
        return refreshTokenService.refresh(payload);
    }
}
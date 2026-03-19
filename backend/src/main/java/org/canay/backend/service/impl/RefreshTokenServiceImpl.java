package org.canay.backend.service.impl;

import org.canay.backend.domain.entities.RefreshToken;
import org.canay.backend.domain.entities.User;
import org.canay.backend.jwt.JwtService;
import org.canay.backend.repository.RefreshTokenRepository;
import org.canay.backend.repository.UserRepository;
import org.canay.backend.service.RefreshTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenServiceImpl implements RefreshTokenService {
//    @Value("${jwt.refreshExpirationMs}")
    private Long refreshTokenDurationMs = 100000000L;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    public RefreshToken createRefreshToken(Long userId) {
        var token = new RefreshToken();
        Optional<User> user = userRepository.findById(userId);

        if (user.isEmpty()) {
            return null;
        }

        token.setUser(user.get());
        token.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
        token.setToken(UUID.randomUUID().toString());

        return refreshTokenRepository.save(token);
    }

    public boolean isTokenExpired(RefreshToken token) {
        return token.getExpiryDate().isBefore(Instant.now());
    }

    @Override
    public ResponseEntity<?> refresh(Map<String, String> payload) {
        String requestToken = payload.get("refreshToken");
        return refreshTokenRepository.findByToken(requestToken)
                .map(token -> {
                    if (isTokenExpired(token)) {
                        refreshTokenRepository.delete(token);
                        return ResponseEntity.badRequest().body("Refresh token expired. Please login again.");
                    }
                    String newJwt = jwtService.generateToken(token.getUser().getUsername());
                    return ResponseEntity.ok(Map.of("token", newJwt));
                })
                .orElse(ResponseEntity.badRequest().body("Invalid refresh token."));
    }
}
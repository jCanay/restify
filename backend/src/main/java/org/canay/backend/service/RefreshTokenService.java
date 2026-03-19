package org.canay.backend.service;

import org.springframework.http.ResponseEntity;

import java.util.Map;

public interface RefreshTokenService {
    ResponseEntity<?> refresh(Map<String, String> payload);
}

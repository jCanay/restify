package org.canay.backend.controller.v1;

import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.dto.AccountDTO;
import org.canay.backend.domain.dto.AddressDTO;
import org.canay.backend.domain.entity.User;
import org.canay.backend.service.AccountService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @PostMapping("/onboarding/complete")
    public ResponseEntity<AccountDTO> completeOnboarding(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(accountService.completeOnboarding(user));
    }

    @GetMapping("/addresses")
    public ResponseEntity<List<AddressDTO>> getAllAddressesByUser(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(accountService.getAllAddressesByUser(user));
    }
}

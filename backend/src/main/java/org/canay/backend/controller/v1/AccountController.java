package org.canay.backend.controller.v1;

import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.dto.AccountDTO;
import org.canay.backend.domain.entities.User;
import org.canay.backend.service.AccountService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @PostMapping("/onboarding/complete")
    public ResponseEntity<AccountDTO> completeOnboarding(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(accountService.completeOnboarding(user.getId()));
    }
}

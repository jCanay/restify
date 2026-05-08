package org.canay.backend.controller.v1;

import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.dto.DashboardDTO;
import org.canay.backend.domain.entities.User;
import org.canay.backend.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
@RequiredArgsConstructor
public class DashboardController {


}

package org.canay.backend.controller;

import org.canay.backend.domain.dto.LoginRequestDTO;
import org.canay.backend.domain.dto.UserDTO;
import org.canay.backend.domain.entities.User;
import org.canay.backend.domain.entities.UserRole;
import org.canay.backend.mappers.Mapper;
import org.canay.backend.repository.UserRepository;
import org.canay.backend.repository.UserRoleRepository;
import org.canay.backend.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserRoleRepository roleRepository;

    @Autowired
    private Mapper<User, UserDTO> userMapper;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public String login(@RequestBody LoginRequestDTO loginRequest) {

        String principal = userRepository.findByUsername(loginRequest.getIdentifier())
                .or(() -> userRepository.findByEmail(loginRequest.getIdentifier()))
                .map(User::getUsername)
                .orElse(loginRequest.getIdentifier());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(principal, loginRequest.getPassword())
        );

        return jwtUtils.generateToken(authentication.getName());
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDTO userDTO) {

        // Verifica si el nombre de usuario existe
        if (userRepository.findByUsername(userDTO.getUsername()).isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body("Error: Username '" + userDTO.getUsername() + "' is already taken!");
        }

        // Verifica si el email ya existe
        if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body("Error: Email '" + userDTO.getEmail() + "' is already in use!");
        }

        // Verifica si existe el rol
        String roleName = (userDTO.getRole() != null) ? userDTO.getRole().getName() : "";
        UserRole roleEntity = roleRepository.findByName(roleName)
                .orElse(null);

        if (roleEntity == null) {
            return ResponseEntity
                    .badRequest()
                    .body("Error: Role '" + roleName + "' does not exists");
        }

        // Crea el usuario
        User userEntity = userMapper.mapFrom(userDTO);

        userEntity.setPassword(passwordEncoder.encode(userEntity.getPassword()));
        userEntity.setRole(roleEntity);

        User savedUserEntity = userRepository.save(userEntity);

        return new ResponseEntity<>(userMapper.mapTo(savedUserEntity), HttpStatus.CREATED);
    }
}
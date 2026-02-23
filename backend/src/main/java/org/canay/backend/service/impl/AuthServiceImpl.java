package org.canay.backend.service.impl;

import org.canay.backend.domain.dto.AuthResponseDTO;
import org.canay.backend.domain.dto.LoginRequestDTO;
import org.canay.backend.domain.dto.RegisterRequestDTO;
import org.canay.backend.domain.entities.User;
import org.canay.backend.domain.entities.UserRole;
import org.canay.backend.jwt.JwtService;
import org.canay.backend.mappers.Mapper;
import org.canay.backend.repository.UserRepository;
import org.canay.backend.repository.UserRoleRepository;
import org.canay.backend.service.AuthService;
import org.canay.backend.exceptions.DuplicateResourceException;
import org.canay.backend.exceptions.RoleNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private Mapper<User, RegisterRequestDTO> registerRequestDTOMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public AuthResponseDTO login(LoginRequestDTO loginRequestDTO) {
        User user = userRepository.findByUsername(loginRequestDTO.getIdentifier())
                .or(() -> userRepository.findByEmail(loginRequestDTO.getIdentifier()))
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), loginRequestDTO.getPassword())
        );

        return AuthResponseDTO.builder().token(jwtService.generateToken(authentication.getName())).build();
    }

    @Override
    public AuthResponseDTO register(RegisterRequestDTO registerRequestDTO) {

        // Verifica si el nombre de usuario existe
        if (userRepository.findByUsername(registerRequestDTO.getUsername()).isPresent()) {
            throw new DuplicateResourceException("Username '" + registerRequestDTO.getUsername() + "' is already taken!");
        }

        // Verifica si el email ya existe
        if (userRepository.findByEmail(registerRequestDTO.getEmail()).isPresent()) {
            throw new DuplicateResourceException("Email '" + registerRequestDTO.getEmail() + "' is already taken!");
        }

        // Verifica si existe el rol
        String roleName = (registerRequestDTO.getRole() != null) ? registerRequestDTO.getRole().getName() : "";
        UserRole roleEntity = userRoleRepository.findByName(roleName)
                .orElse(null);

        if (roleEntity == null) {
            throw new RoleNotFoundException("Role '" + roleName + "' does not exist");
        }

        // Crea el usuario
        User userEntity = registerRequestDTOMapper.mapFrom(registerRequestDTO);

        userEntity.setPassword(passwordEncoder.encode(userEntity.getPassword()));
        userEntity.setRole(roleEntity);

        User savedUserEntity = userRepository.save(userEntity);

        return AuthResponseDTO.builder().token(jwtService.generateToken(savedUserEntity.getUsername())).build();
    }
}

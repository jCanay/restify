package org.canay.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.dto.*;
import org.canay.backend.domain.entities.Account;
import org.canay.backend.domain.entities.Restaurant;
import org.canay.backend.domain.entities.User;
import org.canay.backend.domain.entities.UserRole;
import org.canay.backend.exceptions.DuplicateResourceException;
import org.canay.backend.exceptions.ResourceNotFoundException;
import org.canay.backend.jwt.JwtService;
import org.canay.backend.mappers.Mapper;
import org.canay.backend.repository.AccountRepository;
import org.canay.backend.repository.RestaurantRepository;
import org.canay.backend.repository.UserRepository;
import org.canay.backend.repository.UserRoleRepository;
import org.canay.backend.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final AccountRepository accountRepository;
    private final RestaurantRepository restaurantRepository;

    private final Mapper<User, UserDTO> userMapper;
    private final Mapper<Account, AccountDTO> accountMapper;
    private final Mapper<Restaurant, RestaurantDTO> restaurantMapper;

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public LoginResponseDTO login(LoginRequestDTO loginRequestDTO) {
        // Buscar usuario
        User user = userRepository.findByUsername(loginRequestDTO.getIdentifier())
                .or(() -> userRepository.findByEmail(loginRequestDTO.getIdentifier()))
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Verificar usuario y contraseña
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), loginRequestDTO.getPassword()));

        // Se asegura de que exista la cuenta antes de continuar
        Account account = accountRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        // Crea la respuesta
        LoginResponseDTO response = LoginResponseDTO.builder()
                .token(jwtService.generateToken(authentication.getName()))
                .user(userMapper.mapTo(user))
                .account(accountMapper.mapTo(account))
                .build();

        // Busca restaurante si es ADMIN o OWNER
        if (account.isManager()) {
            response.setRestaurants(
                    restaurantRepository.findAllByAccount(account).stream().map((restaurantMapper::mapTo)).toList()
            );
        }

        return response;
    }

    @Override
    public RegisterResponseDTO register(RegisterRequestDTO registerRequestDTO) {
        // Verifica si el nombre de usuario existe
        if (userRepository.findByUsername(registerRequestDTO.getUser().getUsername()).isPresent()) {
            throw new DuplicateResourceException("El usuario ya está registrado.");
        }

        // Verifica si el email ya existe
        if (userRepository.findByEmail(registerRequestDTO.getUser().getEmail()).isPresent()) {
            throw new DuplicateResourceException("El email ya está registrado.");
        }

        // Verifica si existe el rol
        String roleName = (registerRequestDTO.getUser().getRole() != null) ? registerRequestDTO.getUser()
                .getRole()
                .getName() : "";

        UserRole roleEntity = userRoleRepository.findByName(roleName)
                .orElseThrow(() -> new ResourceNotFoundException("Role '" + roleName + "' does not exist"));

        // Crea el usuario
        User userEntity = userMapper.mapFrom(registerRequestDTO.getUser());

        userEntity.setPassword(passwordEncoder.encode(registerRequestDTO.getPassword()));
        userEntity.setRole(roleEntity);

        // Crea la cuenta
        Account accountEntity = Account.builder()
                .name(registerRequestDTO.getAccount().getName())
                .surname(registerRequestDTO.getAccount().getSurname())
                .user(userEntity)
                .build();

        User savedUserEntity = userRepository.save(userEntity);
        accountRepository.save(accountEntity);

        return RegisterResponseDTO.builder()
                .token(jwtService.generateToken(savedUserEntity.getUsername()))
                .role(userEntity.getRole().getName())
                .build();
    }
}

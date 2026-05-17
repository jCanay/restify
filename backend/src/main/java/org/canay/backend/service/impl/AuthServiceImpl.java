package org.canay.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.dto.*;
import org.canay.backend.domain.entities.Account;
import org.canay.backend.domain.entities.Restaurant;
import org.canay.backend.domain.entities.User;
import org.canay.backend.domain.entities.UserRole;
import org.canay.backend.exception.DuplicateResourceException;
import org.canay.backend.exception.ResourceNotFoundException;
import org.canay.backend.security.jwt.JwtUtils;
import org.canay.backend.mapper.Mapper;
import org.canay.backend.repository.AccountRepository;
import org.canay.backend.repository.RestaurantRepository;
import org.canay.backend.repository.UserRepository;
import org.canay.backend.repository.UserRoleRepository;
import org.canay.backend.service.AuthService;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    private final MessageSource messageSource;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public LoginResponseDTO login(LoginRequestDTO loginRequestDTO) {
        // Buscar usuario
        User user = userRepository.findByUsername(loginRequestDTO.getIdentifier())
                .or(() -> userRepository.findByEmail(loginRequestDTO.getIdentifier()))
                .orElseThrow(() -> new UsernameNotFoundException(messageSource.getMessage("not-found.user", null,
                        LocaleContextHolder.getLocale())));

        // Verificar usuario y contraseña
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), loginRequestDTO.getPassword()));

        // Se asegura de que exista la cuenta antes de continuar
        Account account = accountRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("not-found.account", null,
                        LocaleContextHolder.getLocale())));

        // Crea la respuesta
        LoginResponseDTO response = LoginResponseDTO.builder()
                .token(jwtUtils.generateToken(authentication.getName()))
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
    @Transactional
    public RegisterResponseDTO register(RegisterRequestDTO registerRequestDTO) {
        // Verifica si el nombre de usuario existe
        if (userRepository.findByUsername(registerRequestDTO.getUser().getUsername()).isPresent()) {
            throw new DuplicateResourceException(messageSource.getMessage("duplicate.user.username", null,
                    LocaleContextHolder.getLocale()));
        }

        // Verifica si el email ya existe
        if (userRepository.findByEmail(registerRequestDTO.getUser().getEmail()).isPresent()) {
            throw new DuplicateResourceException(messageSource.getMessage("duplicate.user.email", null,
                    LocaleContextHolder.getLocale()));
        }

        // Verifica si existe el rol
        String roleName = (registerRequestDTO.getUser().getRole() != null) ? registerRequestDTO.getUser()
                .getRole()
                .getName() : "";

        UserRole roleEntity = userRoleRepository.findByName(roleName)
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("not-found.user.role", null,
                        LocaleContextHolder.getLocale())));

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
                .token(jwtUtils.generateToken(savedUserEntity.getUsername()))
                .role(userEntity.getRole().getName())
                .build();
    }
}

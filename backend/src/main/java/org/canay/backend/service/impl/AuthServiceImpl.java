package org.canay.backend.service.impl;

import org.canay.backend.domain.dto.*;
import org.canay.backend.domain.entities.Account;
import org.canay.backend.domain.entities.User;
import org.canay.backend.domain.entities.UserRole;
import org.canay.backend.exceptions.AccountNotFoundException;
import org.canay.backend.jwt.JwtService;
import org.canay.backend.mappers.Mapper;
import org.canay.backend.repository.AccountRepository;
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
    private AccountRepository accountRepository;

    @Autowired
    private Mapper<User, UserDTO> userMapper;

    @Autowired
    private Mapper<Account, AccountDTO> accountMapper;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public LoginResponseDTO login(LoginRequestDTO loginRequestDTO) {
        // Buscar usuario
        User user = userRepository.findByUsername(loginRequestDTO.getIdentifier())
                .or(() -> userRepository.findByEmail(loginRequestDTO.getIdentifier()))
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Verificar usuario y contraseña
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), loginRequestDTO.getPassword()));

        // Buscar cuenta
        Account account = accountRepository.findByUser(user)
                .orElseThrow(() -> new AccountNotFoundException("Account not found"));

        return LoginResponseDTO.builder()
                .token(jwtService.generateToken(authentication.getName()))
                .user(userMapper.mapTo(user))
                .account(accountMapper.mapTo(account))
                .build();
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

        UserRole roleEntity = userRoleRepository.findByName(roleName).orElse(null);

        if (roleEntity == null) {
            throw new RoleNotFoundException("Role '" + roleName + "' does not exist");
        }

        // Crea el usuario
        User userEntity = userMapper.mapFrom(registerRequestDTO.getUser());

        userEntity.setPassword(passwordEncoder.encode(userEntity.getPassword()));
        userEntity.setRole(roleEntity);

        User savedUserEntity = userRepository.save(userEntity);

        // Crea la cuenta
        Account accountEntity = Account.builder()
                .name(registerRequestDTO.getName())
                .surname(registerRequestDTO.getSurname())
                .build();

        accountRepository.save(accountEntity);

        return RegisterResponseDTO.builder()
                .token(jwtService.generateToken(savedUserEntity.getUsername()))
                .role(userEntity.getRole().getName())
                .build();
    }
}

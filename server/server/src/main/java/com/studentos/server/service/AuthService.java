package com.studentos.server.service;

import com.studentos.server.dto.request.LoginRequest;
import com.studentos.server.dto.request.RegisterRequest;
import com.studentos.server.dto.response.AuthResponse;
import com.studentos.server.dto.response.UserResponse;
import com.studentos.server.entity.User;
import com.studentos.server.enums.Role;
import com.studentos.server.exception.BadRequestException;
import com.studentos.server.mapper.UserMapper;
import com.studentos.server.repository.UserRepository;
import com.studentos.server.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthResponse register(RegisterRequest request) {
        // Check if email exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        // Create user
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        User savedUser = userRepository.save(user);

        // Generate token
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        String token = tokenProvider.generateToken(authentication);

        UserResponse userResponse = UserMapper.toResponse(savedUser);
        return new AuthResponse(token, userResponse);
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        UserResponse userResponse = UserMapper.toResponse(user);
        return new AuthResponse(token, userResponse);
    }
}
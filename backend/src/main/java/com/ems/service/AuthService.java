package com.ems.service;

import com.ems.dto.request.LoginRequest;
import com.ems.dto.response.AuthResponse;
import com.ems.entity.User;
import com.ems.repository.UserRepository;
import com.ems.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;

    /**
     * Login with original method (maintains backward compatibility)
     */
    @Transactional
    public AuthResponse login(LoginRequest request) {
        // Spring Security handles BCrypt comparison internally
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow();

        // Generate both access and refresh tokens (V2 enhancement)
        String accessToken = tokenProvider.generateAccessToken(user);
        String refreshToken = tokenProvider.generateRefreshToken(user);

        // Store refresh token in database (V2 enhancement)
        user.setRefreshToken(refreshToken);
        user.setRefreshTokenExpiry(LocalDateTime.now().plusDays(7));
        userRepository.save(user);

        return AuthResponse.builder()
                .token(accessToken)
                .tokenType("Bearer")
                .userId(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .role(user.getRole())
                .refreshToken(refreshToken)
                .build();
    }

    /**
     * Refresh access token using refresh token (V2 addition)
     */
    @Transactional
    public AuthResponse refreshToken(String refreshToken) {
        if (!tokenProvider.validateRefreshToken(refreshToken)) {
            throw new IllegalArgumentException("Invalid or expired refresh token");
        }

        User user = userRepository.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new IllegalArgumentException("Refresh token not found"));

        // Check if refresh token is expired
        if (user.getRefreshTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Refresh token has expired");
        }

        // Generate new access token
        String newAccessToken = tokenProvider.generateAccessToken(user);

        // Optionally generate new refresh token and update
        String newRefreshToken = tokenProvider.generateRefreshToken(user);
        user.setRefreshToken(newRefreshToken);
        user.setRefreshTokenExpiry(LocalDateTime.now().plusDays(7));
        userRepository.save(user);

        return AuthResponse.builder()
                .token(newAccessToken)
                .tokenType("Bearer")
                .userId(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .role(user.getRole())
                .refreshToken(newRefreshToken)
                .build();
    }
}

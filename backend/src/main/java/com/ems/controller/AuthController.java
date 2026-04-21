package com.ems.controller;

import com.ems.dto.request.LoginRequest;
import com.ems.dto.response.ApiResponse;
import com.ems.dto.response.AuthResponse;
import com.ems.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Login endpoint (original + v2 enhanced with refresh token)
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    /**
     * Refresh token endpoint (V2 addition)
     */
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        
        if (refreshToken == null || refreshToken.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Refresh token is required"));
        }

        try {
            AuthResponse response = authService.refreshToken(refreshToken);
            return ResponseEntity.ok(ApiResponse.ok("Token refreshed successfully", response));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Get current user info (V2 addition)
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthResponse.UserInfo>> getCurrentUser() {
        // This would need to be implemented with proper authentication context
        // For now, returning a placeholder
        return ResponseEntity.ok(ApiResponse.ok("User info retrieved", null));
    }
}

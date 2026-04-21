package com.ems.dto.response;

import com.ems.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String tokenType;
    private String userId;
    private String username;
    private String fullName;
    private User.Role role;
    
    // V2 addition for refresh token support
    private String refreshToken;

    // V2 nested class for user info
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfo {
        private String userId;
        private String username;
        private String fullName;
        private User.Role role;
    }
}

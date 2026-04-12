package com.ems.dto.response;

import com.ems.entity.User;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String token;
    private String tokenType;
    private String userId;
    private String username;
    private String fullName;
    private User.Role role;
}

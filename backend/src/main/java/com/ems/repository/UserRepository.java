package com.ems.repository;

import com.ems.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    
    // Original methods
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    
    // V2 addition for refresh token support
    Optional<User> findByRefreshToken(String refreshToken);
}

package com.ems.service;

import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Simple in-memory rate limiting service
 * For production, use Redis or a distributed cache
 */
@Service
public class RateLimitService {

    private static final int MAX_ATTEMPTS = 5;
    private static final Duration LOCKOUT_DURATION = Duration.ofMinutes(15);

    private final Map<String, LoginAttempt> attemptCache = new ConcurrentHashMap<>();

    /**
     * Try to acquire permission for a login attempt
     * @param clientId Unique identifier (IP address, username, etc.)
     * @return true if allowed, false if rate limited
     */
    public boolean tryAcquire(String clientId) {
        LoginAttempt attempt = attemptCache.computeIfAbsent(clientId, k -> new LoginAttempt());

        // Check if still locked out
        if (attempt.isLockedOut()) {
            return false;
        }

        // Increment attempt count
        attempt.incrementAttempts();

        // Lock out if max attempts exceeded
        if (attempt.getAttempts() >= MAX_ATTEMPTS) {
            attempt.lockout();
            return false;
        }

        return true;
    }

    /**
     * Reset attempts for a client (call on successful login)
     */
    public void resetAttempts(String clientId) {
        attemptCache.remove(clientId);
    }

    /**
     * Inner class to track login attempts
     */
    private static class LoginAttempt {
        private int attempts = 0;
        private LocalDateTime lockoutUntil = null;

        public void incrementAttempts() {
            attempts++;
        }

        public int getAttempts() {
            return attempts;
        }

        public void lockout() {
            lockoutUntil = LocalDateTime.now().plus(LOCKOUT_DURATION);
        }

        public boolean isLockedOut() {
            if (lockoutUntil == null) {
                return false;
            }

            if (LocalDateTime.now().isAfter(lockoutUntil)) {
                // Lockout expired, reset
                lockoutUntil = null;
                attempts = 0;
                return false;
            }

            return true;
        }
    }
}

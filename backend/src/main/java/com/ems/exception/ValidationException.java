package com.ems.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown when input validation fails
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class ValidationException extends EmsException {
    
    public ValidationException(String message) {
        super(message, "VALIDATION_ERROR");
    }

    public ValidationException(String field, String message) {
        super(String.format("Validation failed for field '%s': %s", field, message), "VALIDATION_ERROR");
    }
}

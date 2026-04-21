package com.ems.exception;

/**
 * Base exception class for all EMS application exceptions
 */
public class EmsException extends RuntimeException {
    private String errorCode;
    private Object[] args;

    public EmsException(String message) {
        super(message);
    }

    public EmsException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public EmsException(String message, Throwable cause) {
        super(message, cause);
    }

    public EmsException(String message, String errorCode, Object... args) {
        super(message);
        this.errorCode = errorCode;
        this.args = args;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public Object[] getArgs() {
        return args;
    }
}

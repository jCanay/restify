package org.canay.backend.exception;

public class AccessDeniedException extends LocalizedException {
    public AccessDeniedException(String message) {
        super(message);
    }
}

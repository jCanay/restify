package org.canay.backend.exception;

public class ResourceNotFoundException extends LocalizedException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}

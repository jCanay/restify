package org.canay.backend.exception;

public class DuplicateResourceException extends LocalizedException {
    public DuplicateResourceException(String message) {
        super(message);
    }
}

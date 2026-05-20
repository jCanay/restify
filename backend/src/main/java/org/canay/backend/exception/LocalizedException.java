package org.canay.backend.exception;

import org.canay.backend.util.MessageTranslator;

public abstract class LocalizedException extends RuntimeException {

    protected LocalizedException(String messageKey) {
        super(messageKey);
    }

    protected LocalizedException(String messageKey, Throwable cause) {
        super(messageKey, cause);
    }

    @Override
    public String getLocalizedMessage() {
        return MessageTranslator.getMessage(super.getMessage());
    }
}
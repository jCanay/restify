package org.canay.backend.util;

import org.springframework.context.MessageSource;
import org.springframework.context.NoSuchMessageException;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;

@Component
public class MessageTranslator {
    private static MessageSource messageSource;

    public MessageTranslator(MessageSource messageSource) {
        MessageTranslator.messageSource = messageSource;
    }

    /**
     * Traduce una clave properties al idioma de la petición actual.
     * Si no es una clave válida, devuelve el texto original.
     */
    public static String getMessage(String key) {
        if (messageSource == null || key == null) {
            return key;
        }

        try {
            return messageSource.getMessage(key, null, LocaleContextHolder.getLocale());
        } catch (NoSuchMessageException e) {
            // FALLBACK: Evita que el sistema rompa si pasas un String cualquiera
            return key;
        }
    }
}
package org.canay.backend.util;

import org.apache.commons.lang3.StringUtils;

public class StringFormatter {
    public static String normalizeStringUrl(String text) {
        return StringUtils
                .stripAccents(text)
                .trim()
                .toLowerCase()
                .replaceAll(" ", "-");
    }
}

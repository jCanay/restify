package org.canay.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.github.bfsmith.geotimezone.TimeZoneLookup;

@Configuration
public class GeoTimezoneConfig {
    @Bean
    public TimeZoneLookup getTimeZoneLookup() {
        return new TimeZoneLookup();
    }
}

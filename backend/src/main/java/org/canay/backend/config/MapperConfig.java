package org.canay.backend.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MapperConfig {

    @Bean
    public ModelMapper modelMapper(ObjectMapper objectMapper) {
        ModelMapper modelMapper = new ModelMapper();

        // Convertir JsonNode a Object
        Converter<JsonNode, Object> jsonNodeConverter = context -> {
            if (context.getSource() == null) return null;

            return objectMapper.convertValue(context.getSource(), Object.class);
        };
        modelMapper.createTypeMap(JsonNode.class, Object.class).setConverter(jsonNodeConverter);

        // For nested objects
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.LOOSE);

        return modelMapper;
    }
}
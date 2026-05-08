package org.canay.backend.domain.dto;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import com.fasterxml.jackson.annotation.JsonValue;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardPageDTO {
    private Long id;
    private String title;
    private String slug;
    private Integer sortOrder;
    private Object tabs;
    private List<WidgetDTO> widgets;
}

package org.canay.backend.domain.dto;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WidgetDTO {
    private Long id;
    private String type;
    private List<UserRoleDTO> accessRoles;
    private Object layouts;
}

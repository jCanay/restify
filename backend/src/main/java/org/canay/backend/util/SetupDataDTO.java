package org.canay.backend.util;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.canay.backend.domain.dto.AccountDTO;
import org.canay.backend.domain.dto.RestaurantDetailDTO;
import org.canay.backend.domain.dto.UserDTO;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SetupDataDTO {
    private UserDTO user;
    private String password;
    private AccountDTO account;
    private RestaurantDetailDTO restaurantDetail;
}

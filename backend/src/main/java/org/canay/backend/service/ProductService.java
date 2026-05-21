package org.canay.backend.service;

import org.canay.backend.domain.dto.ProductDTO;
import org.canay.backend.domain.entity.User;

import java.util.List;

public interface ProductService {
    List<ProductDTO> getProductsByRestaurant(Long restaurantId, User user);
}

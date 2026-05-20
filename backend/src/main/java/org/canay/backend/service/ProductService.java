package org.canay.backend.service;

import org.canay.backend.domain.dto.ProductDTO;
import org.canay.backend.domain.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductService {
    Page<ProductDTO> getProductsByRestaurant(Long restaurantId, Pageable pageable, User user);
}

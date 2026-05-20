package org.canay.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.dto.ProductDTO;
import org.canay.backend.domain.entity.Product;
import org.canay.backend.domain.entity.User;
import org.canay.backend.mapper.Mapper;
import org.canay.backend.repository.ProductRepository;
import org.canay.backend.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;

    private final Mapper<Product, ProductDTO> productMapper;

    @Override
    public Page<ProductDTO> getProductsByRestaurant(Long restaurantId, Pageable pageable, User user) {
        return productRepository.findByRestaurantId(restaurantId, pageable).map(productMapper::mapTo);
    }
}

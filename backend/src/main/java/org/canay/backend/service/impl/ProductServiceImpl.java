package org.canay.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.dto.ProductDTO;
import org.canay.backend.domain.entity.Product;
import org.canay.backend.domain.entity.User;
import org.canay.backend.mapper.Mapper;
import org.canay.backend.repository.ProductRepository;
import org.canay.backend.service.ProductService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;

    private final Mapper<Product, ProductDTO> productMapper;

    @Override
    public List<ProductDTO> getProductsByRestaurant(Long restaurantId, User user) {
        return productRepository.findByRestaurantId(restaurantId).stream().map(productMapper::mapTo).toList();
    }
}

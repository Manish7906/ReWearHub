package com.rewear.service;

import com.rewear.model.Product;
import com.rewear.repository.ProductRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Page<Product> getProducts(String category, String occasion, String search,
                                     BigDecimal minPrice, BigDecimal maxPrice,
                                     String sortBy, int page, int size) {
        Sort sort;
        if ("price_asc".equals(sortBy)) {
            sort = Sort.by("pricePerDay").ascending();
        } else if ("price_desc".equals(sortBy)) {
            sort = Sort.by("pricePerDay").descending();
        } else if ("rating".equals(sortBy)) {
            sort = Sort.by("rating").descending();
        } else {
            sort = Sort.by("createdAt").descending();
        }

        Pageable pageable = PageRequest.of(page, size, sort);
        String cat = ("All".equalsIgnoreCase(category) || category == null || category.isEmpty()) ? null : category;
        String occ = ("All".equalsIgnoreCase(occasion) || occasion == null || occasion.isEmpty()) ? null : occasion;
        String srch = (search == null || search.isEmpty()) ? null : search;

        return productRepository.findWithFilters(cat, occ, minPrice, maxPrice, srch, pageable);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found: " + id));
    }

    public List<Product> getTrendingProducts() {
        return productRepository.findByTrendingTrueAndAvailableTrue();
    }

    public List<Product> getCelebrityCollections() {
        return productRepository.findByCelebrityCollectionTrueAndAvailableTrue();
    }

    public List<Product> getSRKLooks() {
        return productRepository.findByCelebrityNameIgnoreCase("Shah Rukh Khan");
    }

    @Transactional
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(Long id, Map<String, Object> updates) {
        Product product = getProductById(id);
        if (updates.containsKey("name"))        product.setName(updates.get("name").toString());
        if (updates.containsKey("description")) product.setDescription(updates.get("description").toString());
        if (updates.containsKey("pricePerDay")) product.setPricePerDay(new BigDecimal(updates.get("pricePerDay").toString()));
        if (updates.containsKey("available"))   product.setAvailable((Boolean) updates.get("available"));
        if (updates.containsKey("trending"))    product.setTrending((Boolean) updates.get("trending"));
        return productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        product.setAvailable(false);
        productRepository.save(product);
    }

    @Transactional
    public void updateRating(Long productId, double newRating, int reviewCount) {
        Product product = getProductById(productId);
        product.setRating(newRating);
        product.setReviewCount(reviewCount);
        productRepository.save(product);
    }
}

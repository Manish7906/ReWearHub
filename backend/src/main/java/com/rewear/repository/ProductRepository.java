package com.rewear.repository;

import com.rewear.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByAvailableTrue(Pageable pageable);

    Page<Product> findByCategoryIgnoreCaseAndAvailableTrue(String category, Pageable pageable);

    Page<Product> findByOccasionIgnoreCaseAndAvailableTrue(String occasion, Pageable pageable);

    List<Product> findByTrendingTrueAndAvailableTrue();

    List<Product> findByCelebrityCollectionTrueAndAvailableTrue();

    List<Product> findByCelebrityNameIgnoreCase(String celebrityName);

    @Query("SELECT p FROM Product p WHERE p.available = true " +
           "AND (:category IS NULL OR LOWER(p.category) = LOWER(:category)) " +
           "AND (:occasion IS NULL OR LOWER(p.occasion) = LOWER(:occasion)) " +
           "AND (:minPrice IS NULL OR p.pricePerDay >= :minPrice) " +
           "AND (:maxPrice IS NULL OR p.pricePerDay <= :maxPrice) " +
           "AND (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "     OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Product> findWithFilters(
        @Param("category") String category,
        @Param("occasion") String occasion,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        @Param("search") String search,
        Pageable pageable
    );
}

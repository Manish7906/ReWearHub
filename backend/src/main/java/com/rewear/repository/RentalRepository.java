package com.rewear.repository;

import com.rewear.model.Rental;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RentalRepository extends JpaRepository<Rental, Long> {
    List<Rental> findByUserId(Long userId);
    List<Rental> findByProductId(Long productId);
    List<Rental> findByStatus(Rental.RentalStatus status);

    @Query("SELECT r FROM Rental r WHERE r.product.id = :productId " +
           "AND r.status NOT IN ('CANCELLED', 'RETURNED') " +
           "AND ((r.startDate <= :endDate) AND (r.endDate >= :startDate))")
    List<Rental> findOverlappingRentals(
        @Param("productId") Long productId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
}

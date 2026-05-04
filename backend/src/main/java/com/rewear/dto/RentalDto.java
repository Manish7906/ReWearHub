package com.rewear.dto;

import com.rewear.model.Rental;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class RentalDto {
    private Long id;
    private ProductDto product;
    private LocalDate startDate;
    private LocalDate endDate;
    private int rentalDays;
    private String selectedSize;
    private BigDecimal rentalAmount;
    private BigDecimal depositAmount;
    private BigDecimal totalAmount;
    private Rental.RentalStatus status;
    private String deliveryAddress;
    private LocalDateTime createdAt;
}

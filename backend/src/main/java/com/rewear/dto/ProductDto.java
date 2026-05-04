package com.rewear.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class ProductDto {
    private Long id;
    private String name;
    private String description;
    private BigDecimal pricePerDay;
    private BigDecimal securityDeposit;
    private String category;
    private String occasion;
    private List<String> availableSizes;
    private String imageUrl;
    private List<String> additionalImages;
    private boolean available;
    private boolean trending;
    private boolean celebrityCollection;
    private String celebrityName;
    private String movieName;
    private double rating;
    private int reviewCount;
}

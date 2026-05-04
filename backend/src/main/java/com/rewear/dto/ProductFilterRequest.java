package com.rewear.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductFilterRequest {
    private String category;
    private String occasion;
    private String size;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private String search;
    private String sortBy;   // price_asc, price_desc, rating, newest
    private int page = 0;
    private int pageSize = 12;
}

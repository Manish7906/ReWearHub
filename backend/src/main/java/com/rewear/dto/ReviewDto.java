package com.rewear.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ReviewDto {
    private Long id;
    private String userName;
    private Long productId;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;
}

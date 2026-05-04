package com.rewear.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateRentalRequest {
    @NotNull
    private Long productId;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;

    @NotBlank
    private String selectedSize;

    @NotBlank
    private String deliveryAddress;

    @NotBlank
    private String deliveryCity;

    @NotBlank
    private String deliveryPincode;
}

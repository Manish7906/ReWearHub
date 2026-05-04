package com.rewear.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class CreateOrderRequest {
    @NotEmpty
    private List<CreateRentalRequest> rentals;

    @NotBlank
    private String deliveryAddress;

    @NotBlank
    private String deliveryCity;

    @NotBlank
    private String deliveryState;

    @NotBlank
    private String deliveryPincode;

    private int rewardPointsToUse;
    private String paymentMethod;
}

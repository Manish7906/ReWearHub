package com.rewear.dto;

import com.rewear.model.Donation;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateDonationRequest {
    @NotBlank
    private String donorName;

    @Email
    @NotBlank
    private String donorEmail;

    private String donorPhone;

    @NotBlank
    private String clothesType;

    @Min(1)
    private int quantity;

    private Donation.ClothesCondition condition;

    private String description;

    @NotBlank
    private String pickupAddress;

    private LocalDate preferredPickupDate;
}

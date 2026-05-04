package com.rewear.dto;

import com.rewear.model.Donation;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class DonationDto {
    private Long id;
    private String donorName;
    private String donorEmail;
    private String clothesType;
    private int quantity;
    private Donation.ClothesCondition condition;
    private Donation.DonationStatus status;
    private int rewardPointsAwarded;
    private LocalDateTime createdAt;
}

package com.rewear.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "donations")
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @NotBlank
    private String donorName;

    @NotBlank
    private String donorEmail;

    private String donorPhone;

    @NotBlank
    private String clothesType;

    private int quantity;

    @Enumerated(EnumType.STRING)
    private ClothesCondition condition;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String pickupAddress;

    private LocalDate preferredPickupDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DonationStatus status = DonationStatus.SUBMITTED;

    @Column(nullable = false)
    private int rewardPointsAwarded = 0;

    private String adminNotes;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // ─── Getters ──────────────────────────────────────────────────────────────
    public Long getId() { return id; }
    public User getUser() { return user; }
    public String getDonorName() { return donorName; }
    public String getDonorEmail() { return donorEmail; }
    public String getDonorPhone() { return donorPhone; }
    public String getClothesType() { return clothesType; }
    public int getQuantity() { return quantity; }
    public ClothesCondition getCondition() { return condition; }
    public String getDescription() { return description; }
    public String getPickupAddress() { return pickupAddress; }
    public LocalDate getPreferredPickupDate() { return preferredPickupDate; }
    public DonationStatus getStatus() { return status; }
    public int getRewardPointsAwarded() { return rewardPointsAwarded; }
    public String getAdminNotes() { return adminNotes; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // ─── Setters ──────────────────────────────────────────────────────────────
    public void setId(Long id) { this.id = id; }
    public void setUser(User user) { this.user = user; }
    public void setDonorName(String donorName) { this.donorName = donorName; }
    public void setDonorEmail(String donorEmail) { this.donorEmail = donorEmail; }
    public void setDonorPhone(String donorPhone) { this.donorPhone = donorPhone; }
    public void setClothesType(String clothesType) { this.clothesType = clothesType; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public void setCondition(ClothesCondition condition) { this.condition = condition; }
    public void setDescription(String description) { this.description = description; }
    public void setPickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; }
    public void setPreferredPickupDate(LocalDate preferredPickupDate) { this.preferredPickupDate = preferredPickupDate; }
    public void setStatus(DonationStatus status) { this.status = status; }
    public void setRewardPointsAwarded(int rewardPointsAwarded) { this.rewardPointsAwarded = rewardPointsAwarded; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }

    public enum ClothesCondition {
        BRAND_NEW, EXCELLENT, GOOD, FAIR
    }

    public enum DonationStatus {
        SUBMITTED, UNDER_REVIEW, PICKUP_SCHEDULED, PICKED_UP, PROCESSED, REJECTED
    }
}

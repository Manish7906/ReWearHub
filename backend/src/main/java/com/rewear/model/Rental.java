package com.rewear.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "rentals")
public class Rental {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    private int rentalDays;
    private String selectedSize;

    @Column(nullable = false)
    private BigDecimal rentalAmount;

    @Column(nullable = false)
    private BigDecimal depositAmount;

    @Column(nullable = false)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RentalStatus status = RentalStatus.PENDING;

    private String deliveryAddress;
    private String deliveryCity;
    private String deliveryPincode;

    private LocalDateTime returnedAt;
    private String returnCondition;

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
    public Product getProduct() { return product; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public int getRentalDays() { return rentalDays; }
    public String getSelectedSize() { return selectedSize; }
    public BigDecimal getRentalAmount() { return rentalAmount; }
    public BigDecimal getDepositAmount() { return depositAmount; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public RentalStatus getStatus() { return status; }
    public String getDeliveryAddress() { return deliveryAddress; }
    public String getDeliveryCity() { return deliveryCity; }
    public String getDeliveryPincode() { return deliveryPincode; }
    public LocalDateTime getReturnedAt() { return returnedAt; }
    public String getReturnCondition() { return returnCondition; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // ─── Setters ──────────────────────────────────────────────────────────────
    public void setId(Long id) { this.id = id; }
    public void setUser(User user) { this.user = user; }
    public void setProduct(Product product) { this.product = product; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public void setRentalDays(int rentalDays) { this.rentalDays = rentalDays; }
    public void setSelectedSize(String selectedSize) { this.selectedSize = selectedSize; }
    public void setRentalAmount(BigDecimal rentalAmount) { this.rentalAmount = rentalAmount; }
    public void setDepositAmount(BigDecimal depositAmount) { this.depositAmount = depositAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public void setStatus(RentalStatus status) { this.status = status; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }
    public void setDeliveryCity(String deliveryCity) { this.deliveryCity = deliveryCity; }
    public void setDeliveryPincode(String deliveryPincode) { this.deliveryPincode = deliveryPincode; }
    public void setReturnedAt(LocalDateTime returnedAt) { this.returnedAt = returnedAt; }
    public void setReturnCondition(String returnCondition) { this.returnCondition = returnCondition; }

    public enum RentalStatus {
        PENDING, CONFIRMED, PACKED, OUT_FOR_DELIVERY, DELIVERED,
        RETURN_INITIATED, RETURNED, CANCELLED
    }
}

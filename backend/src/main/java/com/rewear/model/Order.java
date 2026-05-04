package com.rewear.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String orderNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private List<Rental> rentals;

    @Column(nullable = false)
    private BigDecimal subtotal;

    @Column(nullable = false)
    private BigDecimal depositTotal;

    private BigDecimal discount = BigDecimal.ZERO;

    @Column(nullable = false)
    private BigDecimal grandTotal;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.PENDING;

    private String deliveryAddress;
    private String deliveryCity;
    private String deliveryState;
    private String deliveryPincode;

    private int rewardPointsEarned;
    private int rewardPointsUsed;

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
    public String getOrderNumber() { return orderNumber; }
    public User getUser() { return user; }
    public List<Rental> getRentals() { return rentals; }
    public BigDecimal getSubtotal() { return subtotal; }
    public BigDecimal getDepositTotal() { return depositTotal; }
    public BigDecimal getDiscount() { return discount; }
    public BigDecimal getGrandTotal() { return grandTotal; }
    public OrderStatus getStatus() { return status; }
    public String getDeliveryAddress() { return deliveryAddress; }
    public String getDeliveryCity() { return deliveryCity; }
    public String getDeliveryState() { return deliveryState; }
    public String getDeliveryPincode() { return deliveryPincode; }
    public int getRewardPointsEarned() { return rewardPointsEarned; }
    public int getRewardPointsUsed() { return rewardPointsUsed; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // ─── Setters ──────────────────────────────────────────────────────────────
    public void setId(Long id) { this.id = id; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }
    public void setUser(User user) { this.user = user; }
    public void setRentals(List<Rental> rentals) { this.rentals = rentals; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
    public void setDepositTotal(BigDecimal depositTotal) { this.depositTotal = depositTotal; }
    public void setDiscount(BigDecimal discount) { this.discount = discount; }
    public void setGrandTotal(BigDecimal grandTotal) { this.grandTotal = grandTotal; }
    public void setStatus(OrderStatus status) { this.status = status; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }
    public void setDeliveryCity(String deliveryCity) { this.deliveryCity = deliveryCity; }
    public void setDeliveryState(String deliveryState) { this.deliveryState = deliveryState; }
    public void setDeliveryPincode(String deliveryPincode) { this.deliveryPincode = deliveryPincode; }
    public void setRewardPointsEarned(int rewardPointsEarned) { this.rewardPointsEarned = rewardPointsEarned; }
    public void setRewardPointsUsed(int rewardPointsUsed) { this.rewardPointsUsed = rewardPointsUsed; }

    public enum OrderStatus {
        PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, RETURNED
    }
}

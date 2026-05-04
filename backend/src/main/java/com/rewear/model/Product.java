package com.rewear.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull
    @DecimalMin("0.0")
    @Column(name = "price_per_day", nullable = false)
    private BigDecimal pricePerDay;

    @NotNull
    @DecimalMin("0.0")
    @Column(name = "security_deposit", nullable = false)
    private BigDecimal securityDeposit;

    @NotBlank
    private String category;

    @NotBlank
    private String occasion;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_sizes", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "size")
    private List<String> availableSizes;

    private String imageUrl;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    private List<String> additionalImages;

    @Column(nullable = false)
    private boolean available = true;

    @Column(nullable = false)
    private boolean trending = false;

    @Column(nullable = false)
    private boolean celebrityCollection = false;

    private String celebrityName;
    private String movieName;

    @Column(nullable = false)
    private double rating = 0.0;

    @Column(nullable = false)
    private int reviewCount = 0;

    @Column(nullable = false)
    private int totalRentals = 0;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // ─── Lifecycle ────────────────────────────────────────────────────────────

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
    public String getName() { return name; }
    public String getDescription() { return description; }
    public BigDecimal getPricePerDay() { return pricePerDay; }
    public BigDecimal getSecurityDeposit() { return securityDeposit; }
    public String getCategory() { return category; }
    public String getOccasion() { return occasion; }
    public List<String> getAvailableSizes() { return availableSizes; }
    public String getImageUrl() { return imageUrl; }
    public List<String> getAdditionalImages() { return additionalImages; }
    public boolean isAvailable() { return available; }
    public boolean isTrending() { return trending; }
    public boolean isCelebrityCollection() { return celebrityCollection; }
    public String getCelebrityName() { return celebrityName; }
    public String getMovieName() { return movieName; }
    public double getRating() { return rating; }
    public int getReviewCount() { return reviewCount; }
    public int getTotalRentals() { return totalRentals; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // ─── Setters ──────────────────────────────────────────────────────────────

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setPricePerDay(BigDecimal pricePerDay) { this.pricePerDay = pricePerDay; }
    public void setSecurityDeposit(BigDecimal securityDeposit) { this.securityDeposit = securityDeposit; }
    public void setCategory(String category) { this.category = category; }
    public void setOccasion(String occasion) { this.occasion = occasion; }
    public void setAvailableSizes(List<String> availableSizes) { this.availableSizes = availableSizes; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public void setAdditionalImages(List<String> additionalImages) { this.additionalImages = additionalImages; }
    public void setAvailable(boolean available) { this.available = available; }
    public void setTrending(boolean trending) { this.trending = trending; }
    public void setCelebrityCollection(boolean celebrityCollection) { this.celebrityCollection = celebrityCollection; }
    public void setCelebrityName(String celebrityName) { this.celebrityName = celebrityName; }
    public void setMovieName(String movieName) { this.movieName = movieName; }
    public void setRating(double rating) { this.rating = rating; }
    public void setReviewCount(int reviewCount) { this.reviewCount = reviewCount; }
    public void setTotalRentals(int totalRentals) { this.totalRentals = totalRentals; }
}

package com.rewear.service;

import com.rewear.model.*;
import com.rewear.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         ProductRepository productRepository,
                         UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public List<Review> getProductReviews(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
    }

    public List<Review> getUserReviews(Long userId) {
        return reviewRepository.findByUserId(userId);
    }

    @Transactional
    public Review addReview(Long userId, Long productId, int rating, String comment) {
        if (reviewRepository.findByUserIdAndProductId(userId, productId).isPresent()) {
            throw new RuntimeException("You have already reviewed this product");
        }

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));

        Review review = new Review();
        review.setUser(user);
        review.setProduct(product);
        review.setRating(rating);
        review.setComment(comment);

        Review saved = reviewRepository.save(review);
        updateProductRating(productId);

        // Award reward points
        user.setRewardPoints(user.getRewardPoints() + 5);
        userRepository.save(user);

        return saved;
    }

    @Transactional
    public Review updateReview(Long reviewId, Long userId, int rating, String comment) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getUser().getId().equals(userId)) {
            throw new RuntimeException("Not authorized to update this review");
        }

        review.setRating(rating);
        review.setComment(comment);
        Review updated = reviewRepository.save(review);
        updateProductRating(review.getProduct().getId());
        return updated;
    }

    @Transactional
    public void deleteReview(Long reviewId, Long userId) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getUser().getId().equals(userId)) {
            throw new RuntimeException("Not authorized to delete this review");
        }

        Long productId = review.getProduct().getId();
        reviewRepository.delete(review);
        updateProductRating(productId);
    }

    private void updateProductRating(Long productId) {
        Double avgRating = reviewRepository.getAverageRatingByProductId(productId);
        long count = reviewRepository.countByProductId(productId);

        productRepository.findById(productId).ifPresent(product -> {
            product.setRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0);
            product.setReviewCount((int) count);
            productRepository.save(product);
        });
    }
}

package com.rewear.controller;

import com.rewear.model.Review;
import com.rewear.model.User;
import com.rewear.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Review>> getProductReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getProductReviews(productId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Review>> getMyReviews(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(reviewService.getUserReviews(user.getId()));
    }

    @PostMapping
    public ResponseEntity<Review> addReview(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> body) {
        Review review = reviewService.addReview(
            user.getId(),
            Long.parseLong(body.get("productId").toString()),
            Integer.parseInt(body.get("rating").toString()),
            body.get("comment").toString()
        );
        return ResponseEntity.ok(review);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Review> updateReview(
            @PathVariable Long id,
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> body) {
        Review review = reviewService.updateReview(
            id, user.getId(),
            Integer.parseInt(body.get("rating").toString()),
            body.get("comment").toString()
        );
        return ResponseEntity.ok(review);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteReview(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        reviewService.deleteReview(id, user.getId());
        return ResponseEntity.ok(Map.of("message", "Review deleted"));
    }
}

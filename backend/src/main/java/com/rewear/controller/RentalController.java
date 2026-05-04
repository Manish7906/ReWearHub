package com.rewear.controller;

import com.rewear.model.Rental;
import com.rewear.model.User;
import com.rewear.service.RentalService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rentals")
public class RentalController {

    private final RentalService rentalService;

    public RentalController(RentalService rentalService) {
        this.rentalService = rentalService;
    }

    @GetMapping
    public ResponseEntity<List<Rental>> getMyRentals(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(rentalService.getUserRentals(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Rental> getRental(@PathVariable Long id) {
        return ResponseEntity.ok(rentalService.getRentalById(id));
    }

    @GetMapping("/availability")
    public ResponseEntity<Map<String, Boolean>> checkAvailability(
            @RequestParam Long productId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        boolean available = rentalService.isProductAvailable(productId, startDate, endDate);
        return ResponseEntity.ok(Map.of("available", available));
    }

    @PostMapping
    public ResponseEntity<Rental> createRental(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> body) {
        Rental rental = rentalService.createRental(
            user.getId(),
            Long.parseLong(body.get("productId").toString()),
            LocalDate.parse(body.get("startDate").toString()),
            LocalDate.parse(body.get("endDate").toString()),
            body.get("selectedSize").toString(),
            body.get("deliveryAddress").toString(),
            body.get("deliveryCity").toString(),
            body.get("deliveryPincode").toString()
        );
        return ResponseEntity.ok(rental);
    }

    @PostMapping("/{id}/return")
    public ResponseEntity<Rental> initiateReturn(@PathVariable Long id,
                                                  @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(rentalService.initiateReturn(id));
    }
}

package com.rewear.controller;

import com.rewear.model.Donation;
import com.rewear.model.User;
import com.rewear.service.DonationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

    private final DonationService donationService;

    public DonationController(DonationService donationService) {
        this.donationService = donationService;
    }

    @PostMapping
    public ResponseEntity<Donation> submitDonation(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal User user) {

        Donation.ClothesCondition condition = Donation.ClothesCondition.GOOD;
        if (body.containsKey("condition")) {
            try {
                condition = Donation.ClothesCondition.valueOf(
                    body.get("condition").toString().toUpperCase().replace(" ", "_")
                );
            } catch (IllegalArgumentException ignored) {}
        }

        LocalDate pickupDate = null;
        if (body.containsKey("preferredPickupDate") && body.get("preferredPickupDate") != null) {
            try { pickupDate = LocalDate.parse(body.get("preferredPickupDate").toString()); }
            catch (Exception ignored) {}
        }

        Donation donation = donationService.submitDonation(
            body.get("donorName").toString(),
            body.get("donorEmail").toString(),
            body.getOrDefault("donorPhone", "").toString(),
            body.get("clothesType").toString(),
            Integer.parseInt(body.get("quantity").toString()),
            condition,
            body.getOrDefault("description", "").toString(),
            body.get("pickupAddress").toString(),
            pickupDate,
            user != null ? user.getId() : null
        );
        return ResponseEntity.ok(donation);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Donation>> getMyDonations(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(donationService.getUserDonations(user.getId()));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Donation>> getAllDonations(
            @RequestParam(required = false) String status) {
        if (status != null) {
            try {
                return ResponseEntity.ok(
                    donationService.getDonationsByStatus(
                        Donation.DonationStatus.valueOf(status.toUpperCase())
                    )
                );
            } catch (IllegalArgumentException ignored) {}
        }
        return ResponseEntity.ok(donationService.getAllDonations());
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Donation> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        Donation donation = donationService.updateStatus(
            id,
            Donation.DonationStatus.valueOf(body.get("status").toUpperCase()),
            body.getOrDefault("adminNotes", null)
        );
        return ResponseEntity.ok(donation);
    }
}

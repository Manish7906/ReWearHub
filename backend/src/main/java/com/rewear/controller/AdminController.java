package com.rewear.controller;

import com.rewear.model.*;
import com.rewear.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final DonationRepository donationRepository;
    private final RentalRepository rentalRepository;

    public AdminController(UserRepository userRepository,
                           ProductRepository productRepository,
                           OrderRepository orderRepository,
                           PaymentRepository paymentRepository,
                           DonationRepository donationRepository,
                           RentalRepository rentalRepository) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
        this.donationRepository = donationRepository;
        this.rentalRepository = rentalRepository;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        long totalUsers     = userRepository.count();
        long totalProducts  = productRepository.count();
        long totalOrders    = orderRepository.count();
        long totalDonations = donationRepository.count();

        BigDecimal totalRevenue = paymentRepository.findAll().stream()
            .filter(p -> p.getStatus() == Payment.PaymentStatus.SUCCESS)
            .map(Payment::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        long activeRentals = rentalRepository.findByStatus(Rental.RentalStatus.DELIVERED).size()
            + rentalRepository.findByStatus(Rental.RentalStatus.OUT_FOR_DELIVERY).size();

        return ResponseEntity.ok(Map.of(
            "totalUsers",     totalUsers,
            "totalProducts",  totalProducts,
            "totalOrders",    totalOrders,
            "totalDonations", totalDonations,
            "totalRevenue",   totalRevenue,
            "activeRentals",  activeRentals
        ));
    }

    @GetMapping("/orders")
    public ResponseEntity<?> getAllOrders() {
        return ResponseEntity.ok(orderRepository.findAll());
    }

    @GetMapping("/rentals")
    public ResponseEntity<?> getAllRentals() {
        return ResponseEntity.ok(rentalRepository.findAll());
    }

    @PatchMapping("/rentals/{id}/status")
    public ResponseEntity<Rental> updateRentalStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        Rental rental = rentalRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Rental not found"));
        rental.setStatus(Rental.RentalStatus.valueOf(body.get("status").toUpperCase()));
        return ResponseEntity.ok(rentalRepository.save(rental));
    }
}

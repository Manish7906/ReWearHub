package com.rewear.service;

import com.rewear.model.*;
import com.rewear.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class RentalService {

    private final RentalRepository rentalRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public RentalService(RentalRepository rentalRepository,
                         ProductRepository productRepository,
                         UserRepository userRepository) {
        this.rentalRepository = rentalRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public boolean isProductAvailable(Long productId, LocalDate startDate, LocalDate endDate) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        if (!product.isAvailable()) return false;
        List<Rental> overlapping = rentalRepository.findOverlappingRentals(productId, startDate, endDate);
        return overlapping.isEmpty();
    }

    @Transactional
    public Rental createRental(Long userId, Long productId, LocalDate startDate,
                                LocalDate endDate, String selectedSize,
                                String deliveryAddress, String deliveryCity,
                                String deliveryPincode) {
        if (!isProductAvailable(productId, startDate, endDate)) {
            throw new RuntimeException("Product not available for selected dates");
        }

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));

        long days = ChronoUnit.DAYS.between(startDate, endDate);
        if (days < 1) throw new RuntimeException("Rental must be at least 1 day");

        BigDecimal rentalAmount = product.getPricePerDay().multiply(BigDecimal.valueOf(days));
        BigDecimal depositAmount = product.getSecurityDeposit();
        BigDecimal totalAmount = rentalAmount.add(depositAmount);

        Rental rental = new Rental();
        rental.setUser(user);
        rental.setProduct(product);
        rental.setStartDate(startDate);
        rental.setEndDate(endDate);
        rental.setRentalDays((int) days);
        rental.setSelectedSize(selectedSize);
        rental.setRentalAmount(rentalAmount);
        rental.setDepositAmount(depositAmount);
        rental.setTotalAmount(totalAmount);
        rental.setDeliveryAddress(deliveryAddress);
        rental.setDeliveryCity(deliveryCity);
        rental.setDeliveryPincode(deliveryPincode);
        rental.setStatus(Rental.RentalStatus.PENDING);

        return rentalRepository.save(rental);
    }

    public List<Rental> getUserRentals(Long userId) {
        return rentalRepository.findByUserId(userId);
    }

    public Rental getRentalById(Long id) {
        return rentalRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Rental not found: " + id));
    }

    @Transactional
    public Rental updateStatus(Long rentalId, Rental.RentalStatus newStatus) {
        Rental rental = getRentalById(rentalId);
        rental.setStatus(newStatus);
        return rentalRepository.save(rental);
    }

    @Transactional
    public Rental initiateReturn(Long rentalId) {
        Rental rental = getRentalById(rentalId);
        if (rental.getStatus() != Rental.RentalStatus.DELIVERED) {
            throw new RuntimeException("Can only return delivered items");
        }
        rental.setStatus(Rental.RentalStatus.RETURN_INITIATED);
        return rentalRepository.save(rental);
    }

    @Transactional
    public Rental completeReturn(Long rentalId, String condition) {
        Rental rental = getRentalById(rentalId);
        rental.setStatus(Rental.RentalStatus.RETURNED);
        rental.setReturnCondition(condition);
        rental.setReturnedAt(LocalDateTime.now());

        Product product = rental.getProduct();
        product.setAvailable(true);
        productRepository.save(product);

        return rentalRepository.save(rental);
    }
}

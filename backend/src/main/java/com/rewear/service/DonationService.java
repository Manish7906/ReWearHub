package com.rewear.service;

import com.rewear.model.Donation;
import com.rewear.repository.DonationRepository;
import com.rewear.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class DonationService {

    private final DonationRepository donationRepository;
    private final UserRepository userRepository;

    public DonationService(DonationRepository donationRepository,
                            UserRepository userRepository) {
        this.donationRepository = donationRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Donation submitDonation(String donorName, String donorEmail,
                                    String donorPhone, String clothesType,
                                    int quantity, Donation.ClothesCondition condition,
                                    String description, String pickupAddress,
                                    LocalDate preferredPickupDate, Long userId) {
        Donation donation = new Donation();
        donation.setDonorName(donorName);
        donation.setDonorEmail(donorEmail);
        donation.setDonorPhone(donorPhone);
        donation.setClothesType(clothesType);
        donation.setQuantity(quantity);
        donation.setCondition(condition);
        donation.setDescription(description);
        donation.setPickupAddress(pickupAddress);
        donation.setPreferredPickupDate(preferredPickupDate);
        donation.setStatus(Donation.DonationStatus.SUBMITTED);
        donation.setRewardPointsAwarded(0);

        if (userId != null) {
            userRepository.findById(userId).ifPresent(donation::setUser);
        }

        Donation saved = donationRepository.save(donation);

        if (userId != null) {
            awardRewardPoints(userId, saved.getId(), 50);
        }

        System.out.println("Donation submitted by: " + donorName + " (" + donorEmail + ")");
        return saved;
    }

    @Transactional
    public Donation updateStatus(Long donationId, Donation.DonationStatus newStatus,
                                  String adminNotes) {
        Donation donation = donationRepository.findById(donationId)
            .orElseThrow(() -> new RuntimeException("Donation not found"));
        donation.setStatus(newStatus);
        if (adminNotes != null) donation.setAdminNotes(adminNotes);
        return donationRepository.save(donation);
    }

    public List<Donation> getUserDonations(Long userId) {
        return donationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Donation> getAllDonations() {
        return donationRepository.findAll();
    }

    public List<Donation> getDonationsByStatus(Donation.DonationStatus status) {
        return donationRepository.findByStatus(status);
    }

    private void awardRewardPoints(Long userId, Long donationId, int points) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setRewardPoints(user.getRewardPoints() + points);
            userRepository.save(user);

            donationRepository.findById(donationId).ifPresent(donation -> {
                donation.setRewardPointsAwarded(points);
                donationRepository.save(donation);
            });

            System.out.println("Awarded " + points + " reward points to user: " + userId);
        });
    }
}

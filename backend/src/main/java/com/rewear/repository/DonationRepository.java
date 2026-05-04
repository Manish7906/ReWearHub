package com.rewear.repository;

import com.rewear.model.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Donation> findByStatus(Donation.DonationStatus status);
    List<Donation> findByDonorEmail(String email);
}

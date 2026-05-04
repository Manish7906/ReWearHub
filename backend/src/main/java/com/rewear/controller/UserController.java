package com.rewear.controller;

import com.rewear.model.User;
import com.rewear.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/me")
    public ResponseEntity<User> getProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(user);
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> updates) {
        if (updates.containsKey("name"))    user.setName(updates.get("name").toString());
        if (updates.containsKey("phone"))   user.setPhone(updates.get("phone").toString());
        if (updates.containsKey("address")) user.setAddress(updates.get("address").toString());
        if (updates.containsKey("city"))    user.setCity(updates.get("city").toString());
        if (updates.containsKey("state"))   user.setState(updates.get("state").toString());
        if (updates.containsKey("pincode")) user.setPincode(updates.get("pincode").toString());
        return ResponseEntity.ok(userRepository.save(user));
    }

    @PostMapping("/me/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> body) {
        if (!passwordEncoder.matches(body.get("currentPassword"), user.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Current password is incorrect"));
        }
        user.setPassword(passwordEncoder.encode(body.get("newPassword")));
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }

    @GetMapping("/me/rewards")
    public ResponseEntity<Map<String, Object>> getRewards(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(Map.of(
            "rewardPoints", user.getRewardPoints(),
            "pointsValue",  user.getRewardPoints() * 0.5,
            "tier",         calculateTier(user.getRewardPoints())
        ));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(
            userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"))
        );
    }

    private String calculateTier(int points) {
        if (points >= 1000) return "PLATINUM";
        if (points >= 500)  return "GOLD";
        if (points >= 100)  return "SILVER";
        return "BRONZE";
    }
}

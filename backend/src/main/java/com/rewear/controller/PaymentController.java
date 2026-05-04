package com.rewear.controller;

import com.rewear.model.Payment;
import com.rewear.model.User;
import com.rewear.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping("/my")
    public ResponseEntity<List<Payment>> getMyPayments(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(paymentService.getUserPayments(user.getId()));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<Payment> getPaymentByOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(paymentService.getPaymentByOrder(orderId));
    }

    @PostMapping
    public ResponseEntity<Payment> processPayment(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> body) {
        Payment payment = paymentService.processPayment(
            Long.parseLong(body.get("orderId").toString()),
            user.getId(),
            body.getOrDefault("paymentMethod", "CARD").toString(),
            body.getOrDefault("paymentToken", "").toString()
        );
        return ResponseEntity.ok(payment);
    }

    @PostMapping("/{id}/refund-deposit")
    public ResponseEntity<Payment> refundDeposit(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.refundDeposit(id));
    }

    @PostMapping("/webhook")
    public ResponseEntity<Map<String, String>> handleWebhook(
            @RequestBody String payload,
            @RequestHeader(value = "Stripe-Signature", required = false) String sigHeader) {
        // Production: verify stripe signature and handle events
        return ResponseEntity.ok(Map.of("received", "true"));
    }
}

package com.rewear.service;

import com.rewear.model.*;
import com.rewear.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Value("${stripe.api.key:mock}")
    private String stripeApiKey;

    public PaymentService(PaymentRepository paymentRepository,
                          OrderRepository orderRepository,
                          UserRepository userRepository) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Payment processPayment(Long orderId, Long userId,
                                   String paymentMethod, String paymentToken) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setUser(user);
        payment.setAmount(order.getSubtotal().subtract(order.getDiscount()));
        payment.setDepositAmount(order.getDepositTotal());
        payment.setStatus(Payment.PaymentStatus.PROCESSING);

        try {
            payment.setPaymentMethod(Payment.PaymentMethod.valueOf(paymentMethod.toUpperCase()));
        } catch (IllegalArgumentException e) {
            payment.setPaymentMethod(Payment.PaymentMethod.CARD);
        }

        payment = paymentRepository.save(payment);

        try {
            String transactionId = mockGateway();
            payment.setTransactionId(transactionId);
            payment.setStatus(Payment.PaymentStatus.SUCCESS);

            order.setStatus(Order.OrderStatus.CONFIRMED);
            orderRepository.save(order);

            System.out.println("Payment successful: " + transactionId + " for order: " + order.getOrderNumber());
        } catch (Exception e) {
            payment.setStatus(Payment.PaymentStatus.FAILED);
            System.out.println("Payment failed for order: " + order.getOrderNumber() + " — " + e.getMessage());
            throw new RuntimeException("Payment processing failed: " + e.getMessage());
        }

        return paymentRepository.save(payment);
    }

    private String mockGateway() {
        // Replace this method body with real Stripe/Razorpay call in production
        return "TXN-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();
    }

    @Transactional
    public Payment refundDeposit(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
            .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (payment.isDepositRefunded()) {
            throw new RuntimeException("Deposit already refunded");
        }

        payment.setDepositRefunded(true);
        payment.setRefundedAt(LocalDateTime.now());
        payment.setRefundAmount(payment.getDepositAmount());
        payment.setStatus(Payment.PaymentStatus.PARTIALLY_REFUNDED);

        return paymentRepository.save(payment);
    }

    public List<Payment> getUserPayments(Long userId) {
        return paymentRepository.findByUserId(userId);
    }

    public Payment getPaymentByOrder(Long orderId) {
        List<Payment> payments = paymentRepository.findByOrderId(orderId);
        return payments.isEmpty() ? null : payments.get(0);
    }
}

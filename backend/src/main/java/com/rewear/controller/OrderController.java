package com.rewear.controller;

import com.rewear.model.*;
import com.rewear.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final RentalService rentalService;
    private final PaymentService paymentService;

    public OrderController(OrderService orderService,
                           RentalService rentalService,
                           PaymentService paymentService) {
        this.orderService = orderService;
        this.rentalService = rentalService;
        this.paymentService = paymentService;
    }

    @GetMapping
    public ResponseEntity<List<Order>> getMyOrders(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.getUserOrders(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<Order> getOrderByNumber(@PathVariable String orderNumber) {
        return ResponseEntity.ok(orderService.getOrderByNumber(orderNumber));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createOrder(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> body) {

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> rentalRequests = (List<Map<String, Object>>) body.get("rentals");

        List<Rental> rentals = new ArrayList<>();
        for (Map<String, Object> req : rentalRequests) {
            Rental rental = rentalService.createRental(
                user.getId(),
                Long.parseLong(req.get("productId").toString()),
                LocalDate.parse(req.get("startDate").toString()),
                LocalDate.parse(req.get("endDate").toString()),
                req.get("selectedSize").toString(),
                body.get("deliveryAddress").toString(),
                body.get("deliveryCity").toString(),
                body.get("deliveryPincode").toString()
            );
            rentals.add(rental);
        }

        int rewardPointsToUse = body.containsKey("rewardPointsToUse")
            ? Integer.parseInt(body.get("rewardPointsToUse").toString()) : 0;

        Order order = orderService.createOrder(
            user.getId(), rentals,
            body.get("deliveryAddress").toString(),
            body.get("deliveryCity").toString(),
            body.getOrDefault("deliveryState", "").toString(),
            body.get("deliveryPincode").toString(),
            rewardPointsToUse
        );

        Payment payment = paymentService.processPayment(
            order.getId(), user.getId(),
            body.getOrDefault("paymentMethod", "CARD").toString(),
            body.getOrDefault("paymentToken", "").toString()
        );

        Map<String, Object> result = Map.of(
            "order", order,
            "payment", payment,
            "message", "Order placed successfully"
        );
        return ResponseEntity.ok(result);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Order> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        Order.OrderStatus status = Order.OrderStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }
}

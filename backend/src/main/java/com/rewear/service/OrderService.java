package com.rewear.service;

import com.rewear.model.*;
import com.rewear.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    private static final AtomicInteger orderCounter = new AtomicInteger(1);

    public OrderService(OrderRepository orderRepository,
                        UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Order createOrder(Long userId, List<Rental> rentals,
                              String deliveryAddress, String deliveryCity,
                              String deliveryState, String deliveryPincode,
                              int rewardPointsToUse) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        BigDecimal subtotal = rentals.stream()
            .map(Rental::getRentalAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal depositTotal = rentals.stream()
            .map(Rental::getDepositAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal discount = BigDecimal.ZERO;
        if (rewardPointsToUse > 0 && user.getRewardPoints() >= rewardPointsToUse) {
            discount = BigDecimal.valueOf(rewardPointsToUse * 0.5);
            user.setRewardPoints(user.getRewardPoints() - rewardPointsToUse);
        }

        BigDecimal grandTotal = subtotal.add(depositTotal).subtract(discount);

        int pointsEarned = rentals.size() * 10;
        user.setRewardPoints(user.getRewardPoints() + pointsEarned);
        userRepository.save(user);

        Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setUser(user);
        order.setRentals(rentals);
        order.setSubtotal(subtotal);
        order.setDepositTotal(depositTotal);
        order.setDiscount(discount);
        order.setGrandTotal(grandTotal);
        order.setDeliveryAddress(deliveryAddress);
        order.setDeliveryCity(deliveryCity);
        order.setDeliveryState(deliveryState);
        order.setDeliveryPincode(deliveryPincode);
        order.setRewardPointsEarned(pointsEarned);
        order.setRewardPointsUsed(rewardPointsToUse);
        order.setStatus(Order.OrderStatus.PENDING);

        return orderRepository.save(order);
    }

    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found: " + id));
    }

    public Order getOrderByNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
            .orElseThrow(() -> new RuntimeException("Order not found: " + orderNumber));
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, Order.OrderStatus status) {
        Order order = getOrderById(orderId);
        order.setStatus(status);
        return orderRepository.save(order);
    }

    private String generateOrderNumber() {
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        return String.format("RWH-%s-%04d", date, orderCounter.getAndIncrement());
    }
}

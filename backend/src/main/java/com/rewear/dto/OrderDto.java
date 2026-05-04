package com.rewear.dto;

import com.rewear.model.Order;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderDto {
    private Long id;
    private String orderNumber;
    private List<RentalDto> rentals;
    private BigDecimal subtotal;
    private BigDecimal depositTotal;
    private BigDecimal discount;
    private BigDecimal grandTotal;
    private Order.OrderStatus status;
    private String deliveryAddress;
    private int rewardPointsEarned;
    private int rewardPointsUsed;
    private LocalDateTime createdAt;
}

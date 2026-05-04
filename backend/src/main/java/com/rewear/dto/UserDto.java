package com.rewear.dto;

import com.rewear.model.User;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private int rewardPoints;
    private User.Role role;
    private LocalDateTime createdAt;
}

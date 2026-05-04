package com.rewear.service;

import com.rewear.dto.AuthDto;
import com.rewear.model.User;
import com.rewear.repository.UserRepository;
import com.rewear.security.JwtUtil;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // @Lazy on AuthenticationManager breaks the final link of the cycle:
    //   AuthService → AuthenticationManager
    //   AuthenticationManager is provided by SecurityConfig
    //   SecurityConfig → UserDetailsService (AuthService)   <- cycle
    // Lazy proxy defers resolution until first login call, not at startup.
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       @Lazy AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    @Transactional
    public Map<String, Object> register(AuthDto.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(User.Role.USER);
        user.setRewardPoints(0);
        user.setEnabled(true);

        User savedUser = userRepository.save(user);
        String token = jwtUtil.generateToken(savedUser);
        return buildResponse(token, savedUser);
    }

    public Map<String, Object> login(AuthDto.LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        User user = (User) authentication.getPrincipal();
        String token = jwtUtil.generateToken(user);
        return buildResponse(token, user);
    }

    private Map<String, Object> buildResponse(String token, User user) {
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id",           user.getId());
        userMap.put("name",         user.getName());
        userMap.put("email",        user.getEmail());
        userMap.put("phone",        user.getPhone() != null ? user.getPhone() : "");
        userMap.put("role",         user.getRole().name());
        userMap.put("rewardPoints", user.getRewardPoints());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user",  userMap);
        return response;
    }
}

package com.java.homemanagementapi.controllers;

import com.java.homemanagementapi.model.User;
import com.java.homemanagementapi.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PutMapping("/phone")
    public ResponseEntity<?> updatePhone(
            @AuthenticationPrincipal OAuth2User principal,
            @RequestBody Map<String, String> body) {

        String phone = body.get("phoneNumber");
        if (phone == null || phone.isBlank()) {
            return ResponseEntity.badRequest().body("Phone number is required.");
        }

        String email = principal.getAttribute("email");
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPhoneNumber(phone.trim());
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Phone number updated successfully."));
    }
}

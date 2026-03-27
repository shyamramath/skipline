package com.java.homemanagementapi.controllers;

import com.java.homemanagementapi.model.User;
import com.java.homemanagementapi.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/session")
public class SessionController {

    private final UserRepository userRepository;

    // Example in-memory storage (replace with actual repository)
    private final List<Map<String, Object>> inventoryItems = new ArrayList<>();

    public SessionController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> getSession(@AuthenticationPrincipal OAuth2User principal) {
        String userEmail = principal.getAttribute("email");
        System.out.println("User " + userEmail + " is fetching session");

        // Fetch user from database to get stored profile data
        User dbUser = userRepository.findByEmail(userEmail).orElse(null);

        Map<String, Object> userData = new HashMap<>();
        userData.put("email", userEmail != null ? userEmail : "");

        if (dbUser != null) {
            userData.put("name", dbUser.getName() != null ? dbUser.getName() : "");
            userData.put("firstName", dbUser.getGivenName() != null ? dbUser.getGivenName() : "");
            userData.put("lastName", dbUser.getFamilyName() != null ? dbUser.getFamilyName() : "");
            userData.put("picture", dbUser.getPicture() != null ? dbUser.getPicture() : "");
            userData.put("id", dbUser.getId());
        } else {
            // Fallback to OAuth2User attributes
            userData.put("name", principal.getAttribute("name") != null ? principal.getAttribute("name") : "");
            userData.put("firstName", principal.getAttribute("given_name") != null ? principal.getAttribute("given_name") : "");
            userData.put("lastName", principal.getAttribute("family_name") != null ? principal.getAttribute("family_name") : "");
            userData.put("picture", principal.getAttribute("picture") != null ? principal.getAttribute("picture") : "");
        }

        return ResponseEntity.ok(Map.of(
            "user", userData,
            "items", inventoryItems
        ));
    }

    @PostMapping
    public ResponseEntity<?> addInventory(@AuthenticationPrincipal OAuth2User principal,
                                          @RequestBody Map<String, Object> item) {
        String userEmail = principal.getAttribute("email");
        System.out.println("User " + userEmail + " is adding inventory item: " + item);

        item.put("addedBy", userEmail);
        item.put("id", inventoryItems.size() + 1);
        inventoryItems.add(item);

        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Item added successfully",
            "item", item
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getInventoryItem(@AuthenticationPrincipal OAuth2User principal,
                                               @PathVariable int id) {
        String userEmail = principal.getAttribute("email");
        System.out.println("User " + userEmail + " is fetching inventory item: " + id);

        return inventoryItems.stream()
            .filter(item -> item.get("id").equals(id))
            .findFirst()
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInventoryItem(@AuthenticationPrincipal OAuth2User principal,
                                                  @PathVariable int id) {
        String userEmail = principal.getAttribute("email");
        System.out.println("User " + userEmail + " is deleting inventory item: " + id);

        boolean removed = inventoryItems.removeIf(item -> item.get("id").equals(id));

        if (removed) {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Item deleted successfully"
            ));
        }
        return ResponseEntity.notFound().build();
    }
}

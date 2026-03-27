package com.java.homemanagementapi.controllers;

import com.java.homemanagementapi.model.AuthResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @GetMapping("/callback/google")
    public void googleCallback(@AuthenticationPrincipal OAuth2User principal,
                               HttpServletResponse response) throws IOException {
        if (principal == null) {
            response.sendRedirect(frontendUrl + "/auth/failure?error=authentication_failed");
            return;
        }

        // Print all user details from Google response
        System.out.println("============ GOOGLE USER DETAILS ============");
        principal.getAttributes().forEach((key, value) ->
            System.out.println(key + ": " + value)
        );
        System.out.println("==============================================");

        String email = principal.getAttribute("email");
        String name = principal.getAttribute("name");
        String picture = principal.getAttribute("picture");

        // Redirect to frontend with user info as query params
        String redirectUrl = String.format(
            "%s/auth/success?email=%s&name=%s&picture=%s",
            frontendUrl,
            email != null ? email : "",
            name != null ? name : "",
            picture != null ? picture : ""
        );
        System.out.println("Redirect URL: " + redirectUrl);
        response.sendRedirect(redirectUrl);
    }

    @GetMapping("/session")
    public ResponseEntity<?> checkSession(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.ok(Map.of(
                "authenticated", false,
                "message", "No active session"
            ));
        }

        return ResponseEntity.ok(Map.of(
            "authenticated", true,
            "user", Map.of(
                "email", principal.getAttribute("email"),
                "name", principal.getAttribute("name"),
                "picture", principal.getAttribute("picture") != null ? principal.getAttribute("picture") : ""
            )
        ));
    }

    @GetMapping("/user")
    public ResponseEntity<AuthResponse> getCurrentUser(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.ok(new AuthResponse(null, null, null, false));
        }
        AuthResponse authResponse = new AuthResponse(
            principal.getAttribute("email"),
            principal.getAttribute("name"),
            principal.getAttribute("picture"),
            true
        );
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();

        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Logged out successfully"
        ));
    }
}

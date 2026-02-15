package com.java.homemanagementapi.config;

import com.java.homemanagementapi.model.User;
import com.java.homemanagementapi.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Value("${app.frontend.url}")
    private String frontendUrl;

    private final UserRepository userRepository;

    public OAuth2SuccessHandler(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        // Print user details for debugging
        System.out.println("============ GOOGLE USER DETAILS ============");
        oAuth2User.getAttributes().forEach((key, value) ->
            System.out.println(key + ": " + value)
        );
        System.out.println("==============================================");

        // Save or update user in database
        User user = saveOrUpdateUser(oAuth2User);
        System.out.println("User saved/updated with ID: " + user.getId());

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String picture = oAuth2User.getAttribute("picture");

        // Build redirect URL with user info
        String redirectUrl = String.format(
            "%s/auth/success?email=%s&name=%s&picture=%s",
            frontendUrl,
            encode(email),
            encode(name),
            encode(picture)
        );

        System.out.println("Redirecting to: " + redirectUrl);

        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }

    private User saveOrUpdateUser(OAuth2User oAuth2User) {
        String googleId = oAuth2User.getAttribute("sub");

        // Check if user already exists
        User user = userRepository.findByGoogleId(googleId)
            .orElseGet(User::new);

        // Update user details
        user.setGoogleId(googleId);
        user.setEmail(oAuth2User.getAttribute("email"));
        user.setName(oAuth2User.getAttribute("name"));
        user.setGivenName(oAuth2User.getAttribute("given_name"));
        user.setFamilyName(oAuth2User.getAttribute("family_name"));
        user.setPicture(oAuth2User.getAttribute("picture"));
        user.setEmailVerified(oAuth2User.getAttribute("email_verified"));
        user.setLocale(oAuth2User.getAttribute("locale"));

        return userRepository.save(user);
    }

    private String encode(String value) {
        if (value == null) return "";
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }
}

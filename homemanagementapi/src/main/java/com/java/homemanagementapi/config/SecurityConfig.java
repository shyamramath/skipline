package com.java.homemanagementapi.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${app.frontend.url}")
    private String frontendUrl;

    private final OAuth2SuccessHandler oAuth2SuccessHandler;

    public SecurityConfig(OAuth2SuccessHandler oAuth2SuccessHandler) {
        this.oAuth2SuccessHandler = oAuth2SuccessHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/home/fetch/**", "/home/fetchall/**", "/home/search/**", "/home/details/**", "/home/property", "/home/dummyproperty").permitAll()
                .requestMatchers("/barcodes/**").permitAll()
                .requestMatchers("/chat/**").permitAll()
                // Swagger endpoints
                .requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**", "/swagger-resources/**", "/webjars/**").permitAll()
                // All other endpoints require authentication
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2
                .authorizationEndpoint(authorization -> authorization
                    .baseUri("/auth/oauth2/authorize")
                )
                .redirectionEndpoint(redirection -> redirection
                    .baseUri("/auth/callback/*")
                )
                .successHandler(oAuth2SuccessHandler)
                .failureUrl(frontendUrl + "/auth/failure")
            )
            // Custom entry point: return 401 for API/AJAX requests, redirect for browser requests
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint(new ApiAwareAuthenticationEntryPoint("/auth/oauth2/authorize/google"))
            );

        return http.build();
    }

    /**
     * Custom AuthenticationEntryPoint that returns 401 JSON for API/AJAX requests
     * and redirects to login for browser requests.
     */
    private static class ApiAwareAuthenticationEntryPoint implements AuthenticationEntryPoint {
        private final LoginUrlAuthenticationEntryPoint browserEntryPoint;

        public ApiAwareAuthenticationEntryPoint(String loginUrl) {
            this.browserEntryPoint = new LoginUrlAuthenticationEntryPoint(loginUrl);
        }

        @Override
        public void commence(HttpServletRequest request, HttpServletResponse response,
                             AuthenticationException authException) throws IOException, ServletException {
            // Check if this is an AJAX/API request
            String requestedWith = request.getHeader("X-Requested-With");
            String accept = request.getHeader("Accept");
            String contentType = request.getHeader("Content-Type");

            boolean isApiRequest = "XMLHttpRequest".equals(requestedWith) ||
                                   (accept != null && accept.contains("application/json")) ||
                                   (contentType != null && contentType.contains("application/json"));

            if (isApiRequest) {
                // Return 401 JSON response for API requests
                response.setContentType("application/json");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"Please login to access this resource\"}");
            } else {
                // Redirect to login for browser requests
                browserEntryPoint.commence(request, response, authException);
            }
        }
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",
            "https://aneighbour.escuelatech.com",
            "https://www.aneighboratx.com",
            "https://aneighboratx.com"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}

package com.java.homemanagementapi.controllers;

import com.java.homemanagementapi.Home;
import com.java.homemanagementapi.RequestObject;
import com.java.homemanagementapi.constants.UrlConstants;
import com.java.homemanagementapi.model.User;
import com.java.homemanagementapi.repository.HomeRepository;
import com.java.homemanagementapi.repository.UserRepository;
import com.java.homemanagementapi.service.BarcodeService;
import com.java.homemanagementapi.service.EmailService;
import com.java.homemanagementapi.service.TwilioService;
import com.java.homemanagementapi.service.VonageService;
import com.java.homemanagementapi.utils.HttpClient;
import org.springframework.beans.factory.annotation.Value;
import okhttp3.Response;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * Home Details Controller
 */
@RestController
@RequestMapping(UrlConstants.HOME_BASE_PATH)
public class HomeDetailsController {

    private static final Logger log = LoggerFactory.getLogger(HomeDetailsController.class);

    private final HttpClient httpClient;
    private final HomeRepository homeRepository;
    private final UserRepository userRepository;
    private final BarcodeService barcodeService;
    private final TwilioService twilioService;
    private final EmailService emailService;
    private final VonageService vonageService;

    @Value("${app.mail.admin-email:admin@aneighboratx.com}")
    private String adminEmail;

    @Value("${app.sms.admin-phone:}")
    private String adminPhone;

    public HomeDetailsController(HomeRepository homeRepository, UserRepository userRepository,
                                  BarcodeService barcodeService, TwilioService twilioService,
                                  EmailService emailService, VonageService vonageService) {
        this.httpClient = new HttpClient();
        this.homeRepository = homeRepository;
        this.userRepository = userRepository;
        this.barcodeService = barcodeService;
        this.twilioService = twilioService;
        this.emailService = emailService;
        this.vonageService = vonageService;
    }

    @GetMapping(UrlConstants.DETAILS_PATH + "/{assessorId}")
    public ResponseEntity<Home> getHomeDetails(@PathVariable String assessorId) {
        return homeRepository.findByAssessorID(assessorId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(UrlConstants.PROPERTY_PATH)
    public String getPropertyData(@RequestBody RequestObject requestObject) throws Exception {
        Response response = httpClient.fetchPropertyData(requestObject.getAddress());
        return response.body().string();
    }

    @GetMapping("/dummyproperty")
    public String getPropertyDataDmmy() throws IOException {
        ClassPathResource resource = new ClassPathResource("api-reponse/property-pull.json");
        return new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
    }

    @PostMapping("/save")
    public ResponseEntity<String> savePropertyDetails(@AuthenticationPrincipal OAuth2User principal,
                                                       @RequestBody Home home) throws IOException {

//        String barcodeText = home.getFormattedAddress() != null
//            ? home.getFormattedAddress()
//            : home.getAddressLine1() + ", " + home.getCity() + ", " + home.getState() + " " + home.getZipCode();

        String barcodeText = "http://localhost:8080/home/details/"+home.getAssessorID().trim();

        byte[] barcode = barcodeService.generateQrCode(barcodeText);
        home.setBarcode(barcode);

        // Extract first owner name from names array
        if (home.getOwner() != null && home.getOwner().getNames() != null && !home.getOwner().getNames().isEmpty()) {
            home.getOwner().setOwnerName(home.getOwner().getNames().get(0));
        }

        // Link home to authenticated user
        String userEmail = principal.getAttribute("email");
        User user = userRepository.findByEmail(userEmail).orElse(null);
        if (user != null) {
            home.setUser(user);
        }

        boolean exists = homeRepository.findByAssessorID(home.getAssessorID().trim()).isPresent();

        if (exists) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Home with Assessor ID \"" + home.getAssessorID() + "\" already exists.");
        }

        homeRepository.save(home);
        log.info("Home saved successfully with Assessor ID: {}", home.getAssessorID());

        // Send email notifications
        sendEmailNotifications(user, home);

        // Send SMS notifications
        sendSmsNotifications(user, home);

        // WhatsApp notification disabled - uncomment to enable
        // sendWhatsAppNotification(user, home);

        return ResponseEntity.ok("Home with Assessor ID \"" + home.getAssessorID() + "\" saved successfully.");
    }

    private void sendEmailNotifications(User user, Home home) {
        String subject = "New Home Added to Inventory - " + home.getAddressLine1();

        String ownerName = (home.getOwner() != null && home.getOwner().getOwnerName() != null)
                ? home.getOwner().getOwnerName()
                : "N/A";

        String htmlBody = String.format("""
            <html>
            <body style="font-family: Arial, sans-serif;">
                <h2 style="color: #2c3e50;">New Home Added to Inventory</h2>
                <p>A new property has been added to the ANeighbour inventory.</p>

                <h3 style="color: #34495e;">Property Details:</h3>
                <table style="border-collapse: collapse; width: 100%%; max-width: 500px;">
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Owner Name</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">%s</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Address</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">%s</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">City</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">%s</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">State</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">%s</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Zip Code</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">%s</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Assessor ID</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">%s</td>
                    </tr>
                </table>

                <p style="margin-top: 20px; color: #7f8c8d; font-size: 12px;">
                    This is an automated message from ANeighbour Home Management.
                </p>
            </body>
            </html>
            """,
            ownerName,
            home.getAddressLine1(),
            home.getCity(),
            home.getState(),
            home.getZipCode(),
            home.getAssessorID()
        );

        // Send email to the user who added the home
        if (user != null && user.getEmail() != null) {
            try {
                emailService.sendHtmlEmailAsync(user.getEmail(), subject, htmlBody);
                log.info("Email notification sent to user: {}", user.getEmail());
            } catch (Exception e) {
                log.error("Failed to send email to user {}: {}", user.getEmail(), e.getMessage());
            }
        }

        // Send email to ANeighbour admin
        try {
            emailService.sendHtmlEmailAsync(adminEmail, subject, htmlBody);
            log.info("Email notification sent to admin: {}", adminEmail);
        } catch (Exception e) {
            log.error("Failed to send email to admin {}: {}", adminEmail, e.getMessage());
        }
    }

    private void sendSmsNotifications(User user, Home home) {
        String ownerName = (home.getOwner() != null && home.getOwner().getOwnerName() != null)
                ? home.getOwner().getOwnerName()
                : "N/A";

        String message = String.format(
                "ANeighbour: New home added!\nOwner: %s\nAddress: %s\nCity: %s, %s %s",
                ownerName,
                home.getAddressLine1(),
                home.getCity(),
                home.getState(),
                home.getZipCode()
        );

        // Send SMS to user if they have a phone number
        if (user != null && user.getPhoneNumber() != null && !user.getPhoneNumber().isEmpty()) {
            try {
                vonageService.sendSmsAsync(user.getPhoneNumber(), message);
                log.info("SMS notification sent to user: {}", user.getPhoneNumber());
            } catch (Exception e) {
                log.error("Failed to send SMS to user {}: {}", user.getPhoneNumber(), e.getMessage());
            }
        }

        // Send SMS to admin if configured
        if (adminPhone != null && !adminPhone.isEmpty()) {
            try {
                vonageService.sendSmsAsync(adminPhone, message);
                log.info("SMS notification sent to admin: {}", adminPhone);
            } catch (Exception e) {
                log.error("Failed to send SMS to admin {}: {}", adminPhone, e.getMessage());
            }
        }
    }

    private void sendWhatsAppNotification(User user, Home home) {
        String phoneNumber = null;

        // Check if user has a phone number
        if (user != null && user.getPhoneNumber() != null && !user.getPhoneNumber().isEmpty()) {
            phoneNumber = user.getPhoneNumber();
            log.info("User {} has phone number: {}", user.getEmail(), phoneNumber);
        } else {
            log.warn("User does not have a phone number set. User: {}", user != null ? user.getEmail() : "null");
            return;
        }

        try {
            String message = String.format(
                    "New home added to your inventory!\n\nAddress: %s\nCity: %s, %s %s\nAssessor ID: %s",
                    home.getAddressLine1(),
                    home.getCity(),
                    home.getState(),
                    home.getZipCode(),
                    home.getAssessorID()
            );
            log.info("Sending WhatsApp message to: {}", phoneNumber);
            String messageSid = twilioService.sendWhatsAppMessage(phoneNumber, message);
            log.info("WhatsApp message sent successfully. SID: {}", messageSid);
        } catch (Exception e) {
            log.error("Failed to send WhatsApp notification: {}", e.getMessage(), e);
        }
    }

    @GetMapping("/fetchall")
    public List<Home> fetchHomes() {
        return homeRepository.findAll();
    }

    @GetMapping("/myhomes")
    public ResponseEntity<List<Home>> fetchHomesByUser(@AuthenticationPrincipal OAuth2User principal) {
        String userEmail = principal.getAttribute("email");
        List<Home> homes = homeRepository.findByUserEmail(userEmail);
        return ResponseEntity.ok(homes);
    }
}

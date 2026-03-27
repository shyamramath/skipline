package com.java.homemanagementapi.controllers;

import com.java.homemanagementapi.Home;
import com.java.homemanagementapi.RequestObject;
import com.java.homemanagementapi.constants.UrlConstants;
import com.java.homemanagementapi.model.User;
import com.java.homemanagementapi.repository.HomeRepository;
import com.java.homemanagementapi.repository.UserRepository;
import com.java.homemanagementapi.service.BarcodeService;
import com.java.homemanagementapi.utils.HttpClient;
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

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * Home Details Controller
 */
@RestController
@RequestMapping(UrlConstants.HOME_BASE_PATH)
public class HomeDetailsController {

    private final HttpClient httpClient;
    private final HomeRepository homeRepository;
    private final UserRepository userRepository;
    private final BarcodeService barcodeService;

    public HomeDetailsController(HomeRepository homeRepository, UserRepository userRepository, BarcodeService barcodeService) {
        this.httpClient = new HttpClient();
        this.homeRepository = homeRepository;
        this.userRepository = userRepository;
        this.barcodeService = barcodeService;
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
        return ResponseEntity.ok("Home with Assessor ID \"" + home.getAssessorID() + "\" saved successfully.");
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

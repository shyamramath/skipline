package com.java.homemanagementapi.controllers;

import com.java.homemanagementapi.Home;
import com.java.homemanagementapi.constants.UrlConstants;
import com.java.homemanagementapi.repository.HomeRepository;
import com.java.homemanagementapi.service.BarcodeService;
import com.java.homemanagementapi.utils.HttpClient;
import okhttp3.Response;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.ResponseEntity;
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
    private final BarcodeService barcodeService;

    public HomeDetailsController(HomeRepository homeRepository, BarcodeService barcodeService) {
        this.httpClient = new HttpClient();
        this.homeRepository = homeRepository;
        this.barcodeService = barcodeService;
    }

    @GetMapping(UrlConstants.DETAILS_PATH + "/{assessorId}")
    public ResponseEntity<Home> getHomeDetails(@PathVariable String assessorId) {
        return homeRepository.findByAssessorID(assessorId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping(UrlConstants.PROPERTY_PATH)
    public String getPropertyData() throws Exception {
        Response response = httpClient.fetchPropertyData();
        return response.body().string();
    }

    @GetMapping("/dummyproperty")
    public String getPropertyDataDmmy() throws IOException {
        ClassPathResource resource = new ClassPathResource("api-reponse/property-pull.json");
        return new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
    }

    @PostMapping("/save")
    public Home savePropertyDetails(@RequestBody Home home) throws IOException {
        String barcodeText = home.getFormattedAddress() != null
            ? home.getFormattedAddress()
            : home.getAddressLine1() + ", " + home.getCity() + ", " + home.getState() + " " + home.getZipCode();
        byte[] barcode = barcodeService.generateQrCode(barcodeText);
        home.setBarcode(barcode);
        return homeRepository.save(home);
    }

    @GetMapping("/fetchall")
    public List<Home> fetchHomes() {
        return homeRepository.findAll();
    }
}

package com.java.homemanagementapi.controllers;

import com.java.homemanagementapi.Home;
import com.java.homemanagementapi.constants.UrlConstants;
import com.java.homemanagementapi.utils.HttpClient;
import okhttp3.Response;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * Home Details Controller
 */
@RestController
@RequestMapping(UrlConstants.HOME_BASE_PATH)
public class HomeDetailsController {

    private final HttpClient httpClient;

    public HomeDetailsController() {
        this.httpClient = new HttpClient();
    }

    @GetMapping(UrlConstants.DETAILS_PATH)
    public Home getHomeDetails() {
        return new Home("1234 Elm St", "Springfield", "IL", "62704", 2500);
    }

    @GetMapping(UrlConstants.PROPERTY_PATH)
    public String getPropertyData() throws Exception {
        Response response = httpClient.fetchPropertyData();
        return response.body().string();
    }

    @GetMapping("/dummyproperty")
    public String getPropertyDataDmmy() throws IOException {
        ClassPathResource resource = new ClassPathResource("api-reponse/property-pull-dijoy.json");
        return new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
    }

}

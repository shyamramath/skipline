package com.java.homemanagementapi.controllers;

import com.java.homemanagementapi.Home;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Home Details Controller
 */
public class HomeDetailsController {

    @GetMapping("/home/details")
    public Home getHomeDetails(){
                return new Home("1234 Elm St", "Springfield", "IL", "62704", 2500);
    }

}

package com.java.homemanagementapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class HomemanagementapiApplication {

    public static void main(String[] args) {
        SpringApplication.run(HomemanagementapiApplication.class, args);
    }

}

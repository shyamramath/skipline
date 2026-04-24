package com.java.homemanagementapi.model;

import lombok.Data;

import java.util.Map;

@Data
public class WhatsAppRequest {
    private String to;
    private String message;
    private String contentSid;
    private Map<String, String> contentVariables;
}
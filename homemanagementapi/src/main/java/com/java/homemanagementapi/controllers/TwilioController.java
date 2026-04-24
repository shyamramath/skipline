package com.java.homemanagementapi.controllers;

import com.java.homemanagementapi.model.WhatsAppRequest;
import com.java.homemanagementapi.service.TwilioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/twilio")
public class TwilioController {

    private final TwilioService twilioService;

    public TwilioController(TwilioService twilioService) {
        this.twilioService = twilioService;
    }

    @PostMapping("/whatsapp/send")
    public ResponseEntity<Map<String, String>> sendWhatsAppMessage(@RequestBody WhatsAppRequest request) {
        try {
            String messageSid;

            if (request.getContentSid() != null && request.getContentVariables() != null) {
                // Send template message
                if (request.getMessage() != null && !request.getMessage().isEmpty()) {
                    messageSid = twilioService.sendWhatsAppTemplateMessage(
                            request.getTo(),
                            request.getContentSid(),
                            request.getContentVariables(),
                            request.getMessage()
                    );
                } else {
                    messageSid = twilioService.sendWhatsAppTemplateMessage(
                            request.getTo(),
                            request.getContentSid(),
                            request.getContentVariables()
                    );
                }
            } else {
                // Send simple message
                messageSid = twilioService.sendWhatsAppMessage(request.getTo(), request.getMessage());
            }

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "messageSid", messageSid
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/sms/send")
    public ResponseEntity<Map<String, String>> sendSmsMessage(@RequestBody WhatsAppRequest request) {
        try {
            String messageSid = twilioService.sendSmsMessage(request.getTo(), request.getMessage());

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "messageSid", messageSid
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }
}

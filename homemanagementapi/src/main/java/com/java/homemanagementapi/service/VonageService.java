package com.java.homemanagementapi.service;

import com.vonage.client.VonageClient;
import com.vonage.client.sms.MessageStatus;
import com.vonage.client.sms.SmsSubmissionResponse;
import com.vonage.client.sms.messages.TextMessage;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class VonageService {

    private static final Logger log = LoggerFactory.getLogger(VonageService.class);

    @Value("${vonage.api.key}")
    private String apiKey;

    @Value("${vonage.api.secret}")
    private String apiSecret;

    @Value("${vonage.from.number}")
    private String fromNumber;

    private VonageClient vonageClient;

    @PostConstruct
    public void init() {
        vonageClient = VonageClient.builder()
                .apiKey(apiKey)
                .apiSecret(apiSecret)
                .build();
        log.info("VonageService initialized with API key: {}", apiKey);
    }

    /**
     * Send an SMS message
     * @param to Phone number to send to (E.164 format, e.g., +15165672575)
     * @param message The message text
     * @return Message ID if successful, null otherwise
     */
    public String sendSms(String to, String message) {
        TextMessage textMessage = new TextMessage(fromNumber, to, message);

        SmsSubmissionResponse response = vonageClient.getSmsClient().submitMessage(textMessage);
        var firstMessage = response.getMessages().get(0);

        if (firstMessage.getStatus() == MessageStatus.OK) {
            String messageId = firstMessage.getId();
            log.info("SMS sent successfully to {}. Message ID: {}", to, messageId);
            return messageId;
        } else {
            String errorText = firstMessage.getErrorText();
            log.error("Failed to send SMS to {}: {}", to, errorText);
            throw new RuntimeException("SMS failed: " + errorText);
        }
    }

    /**
     * Send an SMS message asynchronously
     */
    @Async
    public void sendSmsAsync(String to, String message) {
        try {
            sendSms(to, message);
        } catch (Exception e) {
            log.error("Async SMS failed to {}: {}", to, e.getMessage());
        }
    }

    /**
     * Send SMS to multiple recipients
     */
    public void sendSmsBulk(String[] recipients, String message) {
        for (String to : recipients) {
            try {
                sendSms(to, message);
            } catch (Exception e) {
                log.error("Failed to send SMS to {}: {}", to, e.getMessage());
            }
        }
    }
}
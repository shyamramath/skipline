package com.java.homemanagementapi.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class TwilioService {

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.whatsapp.from}")
    private String whatsappFrom;

    @PostConstruct
    public void init() {
        Twilio.init(accountSid, authToken);
    }

    /**
     * Send a simple WhatsApp message
     */
    public String sendWhatsAppMessage(String to, String messageBody) {
        Message message = Message.creator(
                new PhoneNumber("whatsapp:" + to),
                new PhoneNumber(whatsappFrom),
                messageBody
        ).create();

        return message.getSid();
    }

    /**
     * Send a WhatsApp message using a template with content variables
     */
    public String sendWhatsAppTemplateMessage(String to, String contentSid, Map<String, String> contentVariables) {
        String variablesJson = convertMapToJson(contentVariables);

        Message message = Message.creator(
                new PhoneNumber("whatsapp:" + to),
                new PhoneNumber(whatsappFrom),
                ""
        )
        .setContentSid(contentSid)
        .setContentVariables(variablesJson)
        .create();

        return message.getSid();
    }

    /**
     * Send a WhatsApp message using a template with content variables and a custom body
     */
    public String sendWhatsAppTemplateMessage(String to, String contentSid, Map<String, String> contentVariables, String messageBody) {
        String variablesJson = convertMapToJson(contentVariables);

        Message message = Message.creator(
                new PhoneNumber("whatsapp:" + to),
                new PhoneNumber(whatsappFrom),
                messageBody
        )
        .setContentSid(contentSid)
        .setContentVariables(variablesJson)
        .create();

        return message.getSid();
    }

    /**
     * Send a simple SMS message
     */
    public String sendSmsMessage(String to, String messageBody) {
        Message message = Message.creator(
                new PhoneNumber(to),
                new PhoneNumber(whatsappFrom.replace("whatsapp:", "")),
                messageBody
        ).create();

        return message.getSid();
    }

    /**
     * Send WhatsApp message asynchronously
     */
    @Async
    public void sendWhatsAppMessageAsync(String to, String messageBody) {
        sendWhatsAppMessage(to, messageBody);
    }

    /**
     * Send WhatsApp template message asynchronously
     */
    @Async
    public void sendWhatsAppTemplateMessageAsync(String to, String contentSid, Map<String, String> contentVariables) {
        sendWhatsAppTemplateMessage(to, contentSid, contentVariables);
    }

    private String convertMapToJson(Map<String, String> map) {
        StringBuilder json = new StringBuilder("{");
        boolean first = true;
        for (Map.Entry<String, String> entry : map.entrySet()) {
            if (!first) {
                json.append(",");
            }
            json.append("\"").append(entry.getKey()).append("\":\"").append(entry.getValue()).append("\"");
            first = false;
        }
        json.append("}");
        return json.toString();
    }
}

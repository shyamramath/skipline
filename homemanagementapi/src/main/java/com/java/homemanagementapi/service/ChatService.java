package com.java.homemanagementapi.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.java.homemanagementapi.model.ChatMessage;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService {

    @Value("${anthropic.api.key}")
    private String apiKey;

    private static final String ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
    private static final String ANTHROPIC_VERSION = "2023-06-01";
    private static final String MODEL = "claude-haiku-4-5-20251001";
    private static final String SYSTEM_PROMPT =
            "You are a helpful home management assistant for ANeighborATX, a home management platform. " +
            "Help users with questions about their properties, home maintenance, inspections, neighborhood info, " +
            "real estate, and any home-related topics. Be concise, friendly, and practical.";

    private final OkHttpClient httpClient = new OkHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String chat(String message, List<ChatMessage> history) throws Exception {
        ObjectNode requestBody = objectMapper.createObjectNode();
        requestBody.put("model", MODEL);
        requestBody.put("max_tokens", 1024);
        requestBody.put("system", SYSTEM_PROMPT);

        ArrayNode messages = objectMapper.createArrayNode();

        if (history != null) {
            for (ChatMessage msg : history) {
                ObjectNode msgNode = objectMapper.createObjectNode();
                msgNode.put("role", msg.getRole());
                msgNode.put("content", msg.getContent());
                messages.add(msgNode);
            }
        }

        ObjectNode userMsg = objectMapper.createObjectNode();
        userMsg.put("role", "user");
        userMsg.put("content", message);
        messages.add(userMsg);

        requestBody.set("messages", messages);

        MediaType jsonType = MediaType.get("application/json; charset=utf-8");
        RequestBody body = RequestBody.create(objectMapper.writeValueAsString(requestBody), jsonType);

        Request request = new Request.Builder()
                .url(ANTHROPIC_API_URL)
                .post(body)
                .addHeader("x-api-key", apiKey)
                .addHeader("anthropic-version", ANTHROPIC_VERSION)
                .addHeader("content-type", "application/json")
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "no body";
                throw new Exception("Anthropic API error " + response.code() + ": " + errorBody);
            }
            String responseBody = response.body().string();
            JsonNode json = objectMapper.readTree(responseBody);
            return json.path("content").get(0).path("text").asText();
        }
    }
}

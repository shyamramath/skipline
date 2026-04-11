package com.java.homemanagementapi.model;

import lombok.Data;

import java.util.List;

@Data
public class ChatRequest {
    private String message;
    private List<ChatMessage> history;
}

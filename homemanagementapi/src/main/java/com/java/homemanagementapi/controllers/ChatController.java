package com.java.homemanagementapi.controllers;

import com.java.homemanagementapi.model.ChatRequest;
import com.java.homemanagementapi.model.ChatResponse;
import com.java.homemanagementapi.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/message")
    public ResponseEntity<ChatResponse> sendMessage(@RequestBody ChatRequest request) {
        try {

            if(false) {
                String reply = chatService.chat(request.getMessage(), request.getHistory());
                return ResponseEntity.ok(new ChatResponse(reply));
            }else{
                return ResponseEntity.ok(new ChatResponse("Chat Support is temporarily unavailable while the website is being finalized. We appreciate your patience and apologize for any inconvenience."));
            }
        } catch (Exception e) {
            System.err.println("ChatService error: " + e.getMessage());
            return ResponseEntity.ok(new ChatResponse("Sorry, I'm having trouble responding right now. Please try again."));
        }
    }
}

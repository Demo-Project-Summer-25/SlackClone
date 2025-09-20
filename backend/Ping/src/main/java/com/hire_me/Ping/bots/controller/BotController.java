package com.hire_me.Ping.bots.controller;

import com.hire_me.Ping.bots.service.OpenAIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bots")
@CrossOrigin(origins = "*")
public class BotController {

    @Autowired
    private OpenAIService openAIService;

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chatWithBot(@RequestBody ChatRequest request) {
        System.out.println(" BotController hit! Message: " + request.getMessage());
        
        try {
            String response = openAIService.sendMessage(request.getMessage(), "user");
            System.out.println(" OpenAI response: " + response);
            return ResponseEntity.ok(new ChatResponse(response));
        } catch (Exception e) {
            System.err.println(" Error in BotController: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(new ChatResponse("Sorry, I encountered an error. Please try again! 🤖"));
        }
    }

    @GetMapping("/status")
    public ResponseEntity<String> getBotStatus() {
        System.out.println(" Bot status endpoint hit");
        return ResponseEntity.ok("PingBot AI is online and ready to help! ");
    }

    // Debug endpoint to test if controller is working
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        System.out.println(" Test endpoint hit");
        return ResponseEntity.ok("BotController is working!");
    }

    public static class ChatRequest {
        private String message;
        
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    public static class ChatResponse {
        private String response;
        private long timestamp;
        
        public ChatResponse(String response) {
            this.response = response;
            this.timestamp = System.currentTimeMillis();
        }
        
        public String getResponse() { return response; }
        public void setResponse(String response) { this.response = response; }
        public long getTimestamp() { return timestamp; }
        public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
    }
}

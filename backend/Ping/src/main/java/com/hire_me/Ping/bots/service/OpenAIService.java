package com.hire_me.Ping.bots.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class OpenAIService {

    @Value("${openai.api.key}")
    private String openaiApiKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public OpenAIService(ObjectMapper objectMapper) {
        this.restTemplate = new RestTemplate();
        this.objectMapper = objectMapper;
    }

    public String sendMessage(String message, String userId) {
        try {
            String requestBody = buildOpenAIRequest(message);
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + openaiApiKey);
            headers.set("Content-Type", "application/json");
            
            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                "https://api.openai.com/v1/chat/completions",
                HttpMethod.POST,
                entity,
                String.class
            );
            
            return extractResponse(response.getBody());
            
        } catch (Exception e) {
            System.err.println("Error calling OpenAI: " + e.getMessage());
            return "Sorry, I'm having trouble connecting to my AI brain right now. Please try again in a moment! 🤖";
        }
    }

    private String buildOpenAIRequest(String message) {
        try {
            return String.format("""
                {
                    "model": "gpt-4o-mini",
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are PingBot, a helpful AI assistant for developers working on a SlackClone project. You help with React/TypeScript frontend, Java Spring Boot backend, debugging, architecture decisions, and general programming advice. Keep responses helpful but concise (under 300 words). Use emojis occasionally to be friendly. Focus on practical, actionable advice."
                        },
                        {
                            "role": "user",
                            "content": "%s"
                        }
                    ],
                    "max_tokens": 500,
                    "temperature": 0.7
                }
                """, escapeJson(message));
        } catch (Exception e) {
            return "{}";
        }
    }

    private String extractResponse(String response) {
        try {
            JsonNode jsonNode = objectMapper.readTree(response);
            JsonNode choices = jsonNode.path("choices");
            if (choices.isArray() && choices.size() > 0) {
                return choices.get(0).path("message").path("content").asText();
            }
            return "Sorry, I couldn't process that response properly.";
        } catch (Exception e) {
            return "Error parsing my response. Please try again! 🔧";
        }
    }

    private String escapeJson(String text) {
        return text.replace("\"", "\\\"")
                  .replace("\n", "\\n")
                  .replace("\r", "\\r")
                  .replace("\t", "\\t");
    }
}
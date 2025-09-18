package com.hire_me.Ping.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Defines the prefix for message destinations that clients can subscribe to.
        // e.g., a client would subscribe to "/topic/messages"
        config.enableSimpleBroker("/topic");
        
        // Defines the prefix for messages that are bound for @MessageMapping-annotated methods.
        // e.g., a client would send a message to "/app/chat"
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Registers the "/ws" endpoint for WebSocket connections.
        // This is the URL that the client will connect to.
        // withSockJS() provides fallback options for browsers that don't support WebSocket.
        registry.addEndpoint("/ws").withSockJS();
    }
}
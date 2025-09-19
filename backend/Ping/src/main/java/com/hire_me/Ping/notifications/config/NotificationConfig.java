package com.hire_me.Ping.notifications.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.messaging.converter.DefaultContentTypeResolver;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.converter.MessageConverter;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.util.List;

@Configuration
@EnableWebSocketMessageBroker
public class NotificationConfig implements WebSocketMessageBrokerConfigurer {

    // Allowlist your real frontend origin(s) in application.yml: app.cors.allowed-origins
    @Value("${app.cors.allowed-origins:*}")
    private List<String> allowedOrigins;

    // ======= WebSocket / STOMP =======

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Clients connect to ws(s)://<host>/ws
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns(allowedOrigins == null || allowedOrigins.isEmpty() ? new String[]{"*"} : allowedOrigins.toArray(String[]::new));
                // .withSockJS(); // Uncomment if you want SockJS fallback
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Client sends to /app/** (if you add @MessageMapping later)
        registry.setApplicationDestinationPrefixes("/app");

        // Broker delivers to /topic/** (broadcast) and /queue/** (per-user)
        registry.enableSimpleBroker("/topic", "/queue");

        // Needed for convertAndSendToUser(..., "/queue/notifications", ...)
        registry.setUserDestinationPrefix("/user");
    }

    /**
     * Make STOMP payloads use JSON with the same ObjectMapper as REST,
     * including proper Java time (OffsetDateTime) as ISO-8601 (not timestamps).
     */
    @Override
    public boolean configureMessageConverters(List<MessageConverter> converters) {
        DefaultContentTypeResolver resolver = new DefaultContentTypeResolver();
        resolver.setDefaultMimeType(MediaType.APPLICATION_JSON);

        MappingJackson2MessageConverter jacksonConverter = new MappingJackson2MessageConverter();
        jacksonConverter.setObjectMapper(objectMapper()); // reuse same mapper as REST
        jacksonConverter.setContentTypeResolver(resolver);

        converters.add(jacksonConverter);
        return false; // keep default converters too (String, bytes, etc.)
    }

    // ======= JSON config (shared) =======

    @Bean
    public ObjectMapper objectMapper() {
        return Jackson2ObjectMapperBuilder.json()
                .modules(new JavaTimeModule())
                .featuresToDisable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS) // ISO-8601 for OffsetDateTime
                .build();
    }
}

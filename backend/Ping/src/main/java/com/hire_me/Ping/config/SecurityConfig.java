package com.hire_me.Ping.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean 
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authorize -> authorize
                // Allow public access to user login/registration
                .requestMatchers("/api/**").permitAll()
                .requestMatchers("/api/users/login", "/api/users/register").permitAll() 
                // Allow public access to Swagger UI and API docs
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                // Allow public access to H2 console
                .requestMatchers("/h2-console/**").permitAll()
                // All other requests must be authenticated
                .anyRequest().authenticated()
            )
            // Disable CSRF for public endpoints
            .csrf(csrf -> csrf
                .ignoringRequestMatchers("/h2-console/**", "/api/users/login", "/api/users/register")
            )
            // Allow H2 console to be displayed in frames
            .headers(headers -> headers
                .frameOptions(frameOptions -> frameOptions.sameOrigin()) // ✅ UPDATED LINE
            )
            // Use default form login for other protected endpoints
            .formLogin(withDefaults());
            
        return http.build();
    }
}
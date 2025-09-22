package com.hire_me.Ping.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 10)
public class UserIdentityFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(UserIdentityFilter.class);
    public static final String USER_ID_ATTRIBUTE = "userId";
    private static final String USER_ID_HEADER = "X-User-Id";
    private static final UUID DEFAULT_USER_ID = UUID.fromString("68973614-94db-4f98-9729-0712e0c5c0fa");

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path == null || !path.startsWith("/api/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        Object existing = request.getAttribute(USER_ID_ATTRIBUTE);
        if (existing == null) {
            UUID resolved = resolveUserId(request);
            if (resolved != null) {
                request.setAttribute(USER_ID_ATTRIBUTE, resolved);
            }
        }
        filterChain.doFilter(request, response);
    }

    private UUID resolveUserId(HttpServletRequest request) {
        String headerValue = request.getHeader(USER_ID_HEADER);
        if (StringUtils.hasText(headerValue)) {
            try {
                return UUID.fromString(headerValue.trim());
            } catch (IllegalArgumentException ex) {
                log.warn("Invalid X-User-Id header value: {}", headerValue);
            }
        }

        String paramValue = request.getParameter(USER_ID_ATTRIBUTE);
        if (StringUtils.hasText(paramValue)) {
            try {
                return UUID.fromString(paramValue.trim());
            } catch (IllegalArgumentException ex) {
                log.warn("Invalid userId query parameter value: {}", paramValue);
            }
        }

        return DEFAULT_USER_ID;
    }
}


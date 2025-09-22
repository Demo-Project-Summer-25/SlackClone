package com.hire_me.Ping.notifications.controller;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hire_me.Ping.notifications.dto.CountResponse;
import com.hire_me.Ping.notifications.dto.ListNotificationsRequest;
import com.hire_me.Ping.notifications.dto.NotificationResponse;
import com.hire_me.Ping.notifications.service.NotificationService;

/**
 * REST Controller: front door for Notifications.
 * 
 * Endpoints covered:
 *   GET    /api/notifications?unread=true|false&limit=50
 *   POST   /api/notifications/{notificationId}/read
 *   POST   /api/notifications/read-all
 *   GET    /api/notifications/unread-count
 *
 * NOTES:
 * - Always acts on the CURRENT USER (from Principal).
 * - No business logic here; delegates to NotificationService.
 */
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    // ---------------------------------------------------------
    // GET /api/notifications?unread=true|false&limit=50
    // List notifications for the current user.
    //   unread=true  -> only unread
    //   unread=false -> all (default)
    //   limit -> max number (server caps at 100)
    // ---------------------------------------------------------
    @GetMapping
    public ResponseEntity<List<NotificationResponse>> list(
            Principal principal,
            @RequestParam(value = "unread", required = false) Boolean unread,
            @RequestParam(value = "limit", required = false) Integer limit
    ) {
        try {
            UUID userId = getCurrentUserId(principal);
            
            // Create the request object that your service expects
            ListNotificationsRequest.Status status = (unread != null && unread) 
                ? ListNotificationsRequest.Status.UNREAD 
                : ListNotificationsRequest.Status.ALL;
            
            ListNotificationsRequest req = new ListNotificationsRequest(
                status,              // Status
                limit,               // Integer  
                null,                // NotificationType (optional)
                null,                // OffsetDateTime (optional)
                null,                // OffsetDateTime (optional) 
                null,                // OffsetDateTime (optional)
                null                 // UUID (optional)
            );
            
            // Use the correct method name
            List<NotificationResponse> notifications = notificationService.listNotifications(userId, req);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            // Return empty list if there's any error
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    // ---------------------------------------------------------
    // POST /api/notifications/{id}/read
    // Mark ONE notification as read.
    // Returns 204 No Content if updated, 404 if not found.
    // ---------------------------------------------------------
    @PostMapping("/{id}/read")
    public ResponseEntity<Void> markOneAsRead(
            Principal principal,
            @PathVariable("id") UUID notificationId
    ) {
        UUID userId = getCurrentUserId(principal);
        boolean updated = notificationService.markAsRead(userId, notificationId);

        return updated
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    // ---------------------------------------------------------
    // POST /api/notifications/read-all
    // Mark ALL unread notifications as read for this user.
    // Returns 204 No Content.
    // ---------------------------------------------------------
    @PostMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(Principal principal) {
        UUID userId = getCurrentUserId(principal);
        notificationService.markAllAsRead(userId);
        return ResponseEntity.noContent().build();
    }

    // ---------------------------------------------------------
    // GET /api/notifications/unread-count
    // Return just the unread count for badge display.
    // Response: { "unread": 7 }
    // ---------------------------------------------------------
    @GetMapping("/unread-count")
    public ResponseEntity<CountResponse> unreadCount(Principal principal) {
        UUID userId = getCurrentUserId(principal);
        CountResponse out = notificationService.countUnread(userId);
        return ResponseEntity.ok(out);
    }

    // ---------------------------------------------------------
    // POST /api/notifications/test/create-demo-data
    // Create demo notifications for testing.
    // Returns 200 OK if successful, 500 if there's an error.
    // ---------------------------------------------------------
    @PostMapping("/test/create-demo-data")
    public ResponseEntity<String> createDemoData() {
        try {
            notificationService.createTestNotifications();
            return ResponseEntity.ok("Demo notifications created successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    // ---------------------------------------------------------
    // Helper: get current user id from Principal
    // NOTE:
    // - In real apps, Principal is often a custom object with userId.
    // - For now, we assume principal.getName() is a UUID string.
    // ---------------------------------------------------------
    private UUID getCurrentUserId(Principal principal) {
        if (principal == null) {
            // Return Jennifer's ID for testing when no authentication
            return UUID.fromString("68973614-94db-4f98-9729-0712e0c5c0fa");
        }
        try {
            return UUID.fromString(principal.getName());
        } catch (IllegalArgumentException e) {
            // Fallback to Jennifer's ID if principal.getName() isn't a valid UUID
            return UUID.fromString("68973614-94db-4f98-9729-0712e0c5c0fa");
        }
    }
}

package com.luv2code.springboot.demo.tsm.controller;

import com.luv2code.springboot.demo.tsm.entity.Notification;
import com.luv2code.springboot.demo.tsm.entity.NotificationSettings;
import com.luv2code.springboot.demo.tsm.entity.enumerator.NotificationType;
import com.luv2code.springboot.demo.tsm.entity.User;
import com.luv2code.springboot.demo.tsm.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:4200")
@Tag(name = "Notifications", description = "Notification management APIs")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    // Tất cả authenticated users có thể xem notifications
    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('ADMIN')")
    @Operation(summary = "Get user notifications with pagination")
    public ResponseEntity<Page<Notification>> getNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();
        Pageable pageable = PageRequest.of(page, size);
        Page<Notification> notifications = notificationService.getUserNotifications(user.getId(), pageable);

        return ResponseEntity.ok(notifications);
    }

    // Tất cả authenticated users có thể xem unread notifications
    @GetMapping("/unread")
    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('ADMIN')")
    @Operation(summary = "Get unread notifications")
    public ResponseEntity<List<Notification>> getUnreadNotifications(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Notification> notifications = notificationService.getUnreadNotifications(user.getId());
        return ResponseEntity.ok(notifications);
    }

    // Tất cả authenticated users có thể xem unread count
    @GetMapping("/unread/count")
    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('ADMIN')")
    @Operation(summary = "Get unread notification count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Long count = notificationService.getUnreadCount(user.getId());
        return ResponseEntity.ok(Map.of("count", count));
    }

    // Tất cả authenticated users có thể filter notifications by type
    @GetMapping("/type/{type}")
    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('ADMIN')")
    @Operation(summary = "Get notifications by type")
    public ResponseEntity<List<Notification>> getNotificationsByType(
            @PathVariable NotificationType type,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Notification> notifications = notificationService.getNotificationsByType(user.getId(), type);
        return ResponseEntity.ok(notifications);
    }

    // Tất cả authenticated users có thể filter notifications by date
    @GetMapping("/date-range")
    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('ADMIN')")
    @Operation(summary = "Get notifications by date range")
    public ResponseEntity<List<Notification>> getNotificationsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Notification> notifications = notificationService.getNotificationsByDateRange(user.getId(), startDate, endDate);
        return ResponseEntity.ok(notifications);
    }

    // Tất cả authenticated users có thể mark as read
    @PutMapping("/{notificationId}/read")
    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('ADMIN')")
    @Operation(summary = "Mark notification as read")
    public ResponseEntity<Map<String, String>> markAsRead(@PathVariable Long notificationId, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        notificationService.markAsRead(notificationId, user.getId());
        return ResponseEntity.ok(Map.of("message", "Notification marked as read"));
    }

    // Tất cả authenticated users có thể mark all as read
    @PutMapping("/read-all")
    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('ADMIN')")
    @Operation(summary = "Mark all notifications as read")
    public ResponseEntity<Map<String, String>> markAllAsRead(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        notificationService.markAllAsRead(user.getId());
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }

    // Tất cả authenticated users có thể xem settings
    @GetMapping("/settings")
    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('ADMIN')")
    @Operation(summary = "Get user notification settings")
    public ResponseEntity<NotificationSettings> getNotificationSettings(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        NotificationSettings settings = notificationService.getUserSettings(user.getId());
        return ResponseEntity.ok(settings);
    }

    // Tất cả authenticated users có thể update settings
    @PutMapping("/settings")
    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('ADMIN')")
    @Operation(summary = "Update notification settings")
    public ResponseEntity<NotificationSettings> updateNotificationSettings(
            @RequestBody NotificationSettings settings,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        NotificationSettings updatedSettings = notificationService.updateUserSettings(user.getId(), settings);
        return ResponseEntity.ok(updatedSettings);
    }
}

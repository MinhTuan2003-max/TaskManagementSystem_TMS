package com.luv2code.springboot.demo.tsm.service;

import com.luv2code.springboot.demo.tsm.entity.*;
import com.luv2code.springboot.demo.tsm.entity.enumerator.EntityType;
import com.luv2code.springboot.demo.tsm.entity.enumerator.NotificationType;
import com.luv2code.springboot.demo.tsm.entity.enumerator.TaskStatus;
import com.luv2code.springboot.demo.tsm.repository.NotificationRepository;
import com.luv2code.springboot.demo.tsm.repository.NotificationSettingsRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private NotificationSettingsRepository settingsRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    public Notification createTaskAssignedNotification(Task task, User actor) {
        if (task.getAssignee() == null || task.getAssignee().getId().equals(actor.getId())) {
            return null; // Không thông báo nếu assign cho chính mình
        }

        // Kiểm tra settings
        if (!isNotificationEnabled(task.getAssignee().getId(), "taskAssigned")) {
            return null;
        }

        String title = "Bạn được giao task mới";
        String message = String.format("%s đã giao cho bạn task: %s",
                actor.getFullName(), task.getTitle());

        Map<String, Object> metadata = createTaskMetadata(task);

        return createAndSendNotification(
                title, message, NotificationType.TASK_ASSIGNED,
                task.getAssignee().getId(), actor.getId(),
                EntityType.TASK, task.getId(), "ASSIGNED", metadata
        );
    }

    public Notification createTaskCompletedNotification(Task task, User actor) {
        String title = "Task đã hoàn thành";
        String message = String.format("%s đã hoàn thành task: %s",
                actor.getFullName(), task.getTitle());

        // Thông báo cho người tạo task (nếu khác người hoàn thành)
        Long recipientId = null;
        if (task.getCreator() != null && !task.getCreator().getId().equals(actor.getId())) {
            recipientId = task.getCreator().getId();
        } else if (task.getProject() != null && task.getProject().getOwner() != null
                && !task.getProject().getOwner().getId().equals(actor.getId())) {
            recipientId = task.getProject().getOwner().getId();
        }

        if (recipientId == null || !isNotificationEnabled(recipientId, "taskCompleted")) {
            return null;
        }

        Map<String, Object> metadata = createTaskMetadata(task);

        return createAndSendNotification(
                title, message, NotificationType.TASK_COMPLETED,
                recipientId, actor.getId(),
                EntityType.TASK, task.getId(), "COMPLETED", metadata
        );
    }

    public Notification createTaskStatusChangedNotification(Task task, User actor, TaskStatus oldStatus) {
        // Chỉ thông báo khi status thay đổi thật sự
        if (task.getStatus() == oldStatus) {
            return null;
        }

        String title = "Trạng thái task đã thay đổi";
        String message = String.format("%s đã thay đổi trạng thái task '%s' từ %s thành %s",
                actor.getFullName(), task.getTitle(),
                getStatusDisplayName(oldStatus),
                getStatusDisplayName(task.getStatus()));

        // Thông báo cho assignee nếu khác người thay đổi
        Long recipientId = null;
        if (task.getAssignee() != null && !task.getAssignee().getId().equals(actor.getId())) {
            recipientId = task.getAssignee().getId();
        } else if (task.getCreator() != null && !task.getCreator().getId().equals(actor.getId())) {
            recipientId = task.getCreator().getId();
        }

        if (recipientId == null || !isNotificationEnabled(recipientId, "taskStatusChanged")) {
            return null;
        }

        Map<String, Object> metadata = createTaskMetadata(task);
        metadata.put("oldStatus", oldStatus.toString());
        metadata.put("newStatus", task.getStatus().toString());

        return createAndSendNotification(
                title, message, NotificationType.TASK_STATUS_CHANGED,
                recipientId, actor.getId(),
                EntityType.TASK, task.getId(), "STATUS_CHANGED", metadata
        );
    }

    public Notification createCommentAddedNotification(Comment comment, User actor) {
        Task task = comment.getTask();
        String title = "Có bình luận mới";
        String message = String.format("%s đã bình luận về task: %s",
                actor.getFullName(), task.getTitle());

        // Thông báo cho assignee hoặc creator (nếu khác người comment)
        Long recipientId = null;
        if (task.getAssignee() != null && !task.getAssignee().getId().equals(actor.getId())) {
            recipientId = task.getAssignee().getId();
        } else if (task.getCreator() != null && !task.getCreator().getId().equals(actor.getId())) {
            recipientId = task.getCreator().getId();
        }

        if (recipientId == null || !isNotificationEnabled(recipientId, "commentAdded")) {
            return null;
        }

        Map<String, Object> metadata = createTaskMetadata(task);
        metadata.put("commentId", comment.getId());
        metadata.put("commentPreview", comment.getContent().length() > 100 ?
                comment.getContent().substring(0, 100) + "..." : comment.getContent());

        return createAndSendNotification(
                title, message, NotificationType.COMMENT_ADDED,
                recipientId, actor.getId(),
                EntityType.COMMENT, comment.getId(), "ADDED", metadata
        );
    }

    public Notification createProjectUpdatedNotification(Project project, User actor) {
        String title = "Dự án đã được cập nhật";
        String message = String.format("%s đã cập nhật dự án: %s",
                actor.getFullName(), project.getName());

        // Thông báo cho owner nếu khác người cập nhật
        Long recipientId = null;
        if (project.getOwner() != null && !project.getOwner().getId().equals(actor.getId())) {
            recipientId = project.getOwner().getId();
        }

        if (recipientId == null || !isNotificationEnabled(recipientId, "projectUpdated")) {
            return null;
        }

        Map<String, Object> metadata = new HashMap<>();
        metadata.put("projectId", project.getId());
        metadata.put("projectName", project.getName());

        return createAndSendNotification(
                title, message, NotificationType.PROJECT_UPDATED,
                recipientId, actor.getId(),
                EntityType.PROJECT, project.getId(), "UPDATED", metadata
        );
    }

    public Notification createProjectMemberAddedNotification(Project project, User newMember, User actor) {
        if (newMember.getId().equals(actor.getId())) {
            return null; // Không thông báo khi tự thêm mình
        }

        String title = "Bạn đã được thêm vào dự án";
        String message = String.format("%s đã thêm bạn vào dự án: %s",
                actor.getFullName(), project.getName());

        if (!isNotificationEnabled(newMember.getId(), "projectMemberAdded")) {
            return null;
        }

        Map<String, Object> metadata = new HashMap<>();
        metadata.put("projectId", project.getId());
        metadata.put("projectName", project.getName());

        return createAndSendNotification(
                title, message, NotificationType.PROJECT_MEMBER_ADDED,
                newMember.getId(), actor.getId(),
                EntityType.PROJECT, project.getId(), "MEMBER_ADDED", metadata
        );
    }

    public Page<Notification> getUserNotifications(Long userId, Pageable pageable) {
        return notificationRepository.findByRecipientIdWithActorOrderByCreatedAtDesc(userId, pageable);
    }

    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }

    public Long getUnreadCount(Long userId) {
        return notificationRepository.countByRecipientIdAndIsReadFalse(userId);
    }

    public List<Notification> getNotificationsByType(Long userId, NotificationType type) {
        return notificationRepository.findByRecipientIdAndTypeOrderByCreatedAtDesc(userId, type);
    }

    public List<Notification> getNotificationsByDateRange(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        return notificationRepository.findByRecipientIdAndDateRange(userId, startDate, endDate);
    }

    public void markAsRead(Long notificationId, Long userId) {
        int updated = notificationRepository.markAsReadById(notificationId, userId);

        if (updated > 0) {
            // Send real-time update
            sendNotificationReadUpdate(userId, notificationId);
        }
    }

    public void markAllAsRead(Long userId) {
        int updatedCount = notificationRepository.markAllAsReadByRecipientId(userId);

        if (updatedCount > 0) {
            // Send real-time update
            sendAllNotificationsReadUpdate(userId, updatedCount);
        }
    }




    public NotificationSettings getUserSettings(Long userId) {
        return settingsRepository.findByUserId(userId)
                .orElseGet(() -> createDefaultSettings(userId));
    }

    public NotificationSettings updateUserSettings(Long userId, NotificationSettings settings) {
        settings.setUserId(userId);
        return settingsRepository.save(settings);
    }

    private NotificationSettings createDefaultSettings(Long userId) {
        NotificationSettings settings = new NotificationSettings(userId);
        return settingsRepository.save(settings);
    }

    // ===========================================
    // UTILITY METHODS
    // ===========================================

    private boolean isNotificationEnabled(Long userId, String notificationType) {
        try {
            NotificationSettings settings = getUserSettings(userId);
            switch (notificationType) {
                case "taskAssigned": return settings.isTaskAssigned();
                case "taskCompleted": return settings.isTaskCompleted();
                case "taskUpdated": return settings.isTaskUpdated();
                case "taskStatusChanged": return settings.isTaskStatusChanged();
                case "projectUpdated": return settings.isProjectUpdated();
                case "commentAdded": return settings.isCommentAdded();
                case "projectMemberAdded": return settings.isProjectMemberAdded();
                default: return true;
            }
        } catch (Exception e) {
            return true; // Default to enabled if error
        }
    }

    private Map<String, Object> createTaskMetadata(Task task) {
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("taskId", task.getId());
        metadata.put("taskTitle", task.getTitle());
        metadata.put("taskPriority", task.getPriority().toString());
        metadata.put("taskStatus", task.getStatus().toString());

        if (task.getProject() != null) {
            metadata.put("projectId", task.getProject().getId());
            metadata.put("projectName", task.getProject().getName());
        }

        if (task.getDeadline() != null) {
            metadata.put("deadline", task.getDeadline().toString());
        }

        return metadata;
    }

    private String getStatusDisplayName(TaskStatus status) {
        switch (status) {
            case TODO: return "Cần làm";
            case IN_PROGRESS: return "Đang thực hiện";
            case DONE: return "Hoàn thành";
            default: return status.toString();
        }
    }

    private Notification createAndSendNotification(String title, String message, NotificationType type,
                                                   Long recipientId, Long actorId, EntityType entityType,
                                                   Long entityId, String actionType, Map<String, Object> metadata) {
        try {
            Notification notification = new Notification(title, message, type, recipientId, actorId, entityType, entityId, actionType);

            if (metadata != null && !metadata.isEmpty()) {
                notification.setMetadata(objectMapper.writeValueAsString(metadata));
            }

            notification = notificationRepository.save(notification);

            // Send real-time notification
            sendRealTimeNotification(notification, metadata);

            return notification;

        } catch (Exception e) {
            System.err.println("Error creating notification: " + e.getMessage());
            return null;
        }
    }

    private void sendRealTimeNotification(Notification notification, Map<String, Object> metadata) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("id", notification.getId());
            payload.put("title", notification.getTitle());
            payload.put("message", notification.getMessage());
            payload.put("type", notification.getType().toString());
            payload.put("entityType", notification.getEntityType());
            payload.put("entityId", notification.getEntityId());
            payload.put("actionType", notification.getActionType());
            payload.put("createdAt", notification.getCreatedAt());
            payload.put("isRead", notification.isRead());

            if (metadata != null) {
                payload.put("metadata", metadata);
            }

            // Actor information nếu có
            if (notification.getActor() != null) {
                Map<String, Object> actorInfo = new HashMap<>();
                actorInfo.put("id", notification.getActor().getId());
                actorInfo.put("fullName", notification.getActor().getFullName());
                actorInfo.put("avatarUrl", notification.getActor().getAvatarUrl());
                payload.put("actor", actorInfo);
            }

            // Send to specific user
            messagingTemplate.convertAndSendToUser(
                    notification.getRecipientId().toString(),
                    "/queue/notifications",
                    payload
            );

        } catch (Exception e) {
            System.err.println("Failed to send real-time notification: " + e.getMessage());
        }
    }

    private void sendNotificationReadUpdate(Long userId, Long notificationId) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("notificationId", notificationId);
            payload.put("action", "READ");

            messagingTemplate.convertAndSendToUser(
                    userId.toString(),
                    "/queue/notification-updates",
                    payload
            );
        } catch (Exception e) {
            System.err.println("Failed to send notification read update: " + e.getMessage());
        }
    }

    private void sendAllNotificationsReadUpdate(Long userId, int updatedCount) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("updatedCount", updatedCount);
            payload.put("action", "READ_ALL");

            messagingTemplate.convertAndSendToUser(
                    userId.toString(),
                    "/queue/notification-updates",
                    payload
            );
        } catch (Exception e) {
            System.err.println("Failed to send all notifications read update: " + e.getMessage());
        }
    }

    @Transactional
    public void cleanupOldNotifications() {
        // Xóa notifications cũ hơn 3 tháng
        LocalDateTime cutoffDate = LocalDateTime.now().minusMonths(3);
        notificationRepository.deleteOldNotifications(cutoffDate);
    }
}

package com.luv2code.springboot.demo.tsm.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification_settings")
public class NotificationSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "email_notifications")
    private boolean emailNotifications = true;

    @Column(name = "push_notifications")
    private boolean pushNotifications = true;

    @Column(name = "task_assigned")
    private boolean taskAssigned = true;

    @Column(name = "task_completed")
    private boolean taskCompleted = true;

    @Column(name = "task_updated")
    private boolean taskUpdated = true;

    @Column(name = "task_status_changed")
    private boolean taskStatusChanged = true;

    @Column(name = "project_updated")
    private boolean projectUpdated = true;

    @Column(name = "comment_added")
    private boolean commentAdded = true;

    @Column(name = "project_member_added")
    private boolean projectMemberAdded = true;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public NotificationSettings() {}

    public NotificationSettings(Long userId) {
        this.userId = userId;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public boolean isEmailNotifications() { return emailNotifications; }
    public void setEmailNotifications(boolean emailNotifications) { this.emailNotifications = emailNotifications; }

    public boolean isPushNotifications() { return pushNotifications; }
    public void setPushNotifications(boolean pushNotifications) { this.pushNotifications = pushNotifications; }

    public boolean isTaskAssigned() { return taskAssigned; }
    public void setTaskAssigned(boolean taskAssigned) { this.taskAssigned = taskAssigned; }

    public boolean isTaskCompleted() { return taskCompleted; }
    public void setTaskCompleted(boolean taskCompleted) { this.taskCompleted = taskCompleted; }

    public boolean isTaskUpdated() { return taskUpdated; }
    public void setTaskUpdated(boolean taskUpdated) { this.taskUpdated = taskUpdated; }

    public boolean isTaskStatusChanged() { return taskStatusChanged; }
    public void setTaskStatusChanged(boolean taskStatusChanged) { this.taskStatusChanged = taskStatusChanged; }

    public boolean isProjectUpdated() { return projectUpdated; }
    public void setProjectUpdated(boolean projectUpdated) { this.projectUpdated = projectUpdated; }

    public boolean isCommentAdded() { return commentAdded; }
    public void setCommentAdded(boolean commentAdded) { this.commentAdded = commentAdded; }

    public boolean isProjectMemberAdded() { return projectMemberAdded; }
    public void setProjectMemberAdded(boolean projectMemberAdded) { this.projectMemberAdded = projectMemberAdded; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

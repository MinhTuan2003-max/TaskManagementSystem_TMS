package com.luv2code.springboot.demo.tsm.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Builder.Default
    private boolean emailNotifications = true;

    @Builder.Default
    private boolean pushNotifications = true;

    @Builder.Default
    private boolean taskAssigned = true;

    @Builder.Default
    private boolean taskCompleted = true;

    @Builder.Default
    private boolean taskUpdated = true;

    @Builder.Default
    private boolean taskStatusChanged = true;

    @Builder.Default
    private boolean projectUpdated = true;

    @Builder.Default
    private boolean commentAdded = true;

    @Builder.Default
    private boolean projectMemberAdded = true;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}

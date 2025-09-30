package com.luv2code.springboot.demo.tsm.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.luv2code.springboot.demo.tsm.entity.enumerator.EntityType;
import com.luv2code.springboot.demo.tsm.entity.enumerator.NotificationType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private NotificationType type = NotificationType.INFO;

    @Column(name = "is_read")
    @Builder.Default
    private boolean isRead = false;

    @Column(name = "recipient_id", nullable = false)
    private Long recipientId;

    @Column(name = "actor_id")
    private Long actorId;

    @Enumerated(EnumType.STRING)
    @Column(name = "entity_type")
    private EntityType entityType;

    @Column(name = "entity_id")
    private Long entityId;

    @Column(name = "action_type")
    private String actionType;

    @Column(columnDefinition = "JSON")
    private String metadata;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"password", "roles", "ownedProjects", "assignedTasks", "createdTasks"})
    private User recipient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actor_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"password", "roles", "ownedProjects", "assignedTasks", "createdTasks"})
    private User actor;

    @CreationTimestamp
    @Column(updatable = false, name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

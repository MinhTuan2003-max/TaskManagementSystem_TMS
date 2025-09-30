package com.luv2code.springboot.demo.tsm.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.luv2code.springboot.demo.tsm.entity.enumerator.ProjectRole;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "project_members")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    @JsonIgnoreProperties({"tasks", "members"})
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"assignedTasks", "createdTasks", "ownedProjects"})
    private User user;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ProjectRole role = ProjectRole.MEMBER;

    @CreationTimestamp
    @Column(name = "joined_at", updatable = false)
    private LocalDateTime joinedAt;
}

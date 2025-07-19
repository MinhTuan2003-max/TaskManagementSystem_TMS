package com.luv2code.springboot.demo.tsm.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.luv2code.springboot.demo.tsm.entity.enumerator.ProjectRole;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "project_members")
@Data
public class ProjectMember {

    // Getters and Setters
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    @JsonIgnoreProperties({"tasks", "members"})
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"assignedTasks", "createdTasks", "ownedProjects"})
    private User user;

    @Enumerated(EnumType.STRING)
    private ProjectRole role = ProjectRole.MEMBER;

    @CreationTimestamp
    @Column(name = "joined_at")
    private LocalDateTime joinedAt;

    // Constructors
    public ProjectMember() {}

    public ProjectMember(Project project, User user, ProjectRole role) {
        this.project = project;
        this.user = user;
        this.role = role;
    }

}

package com.luv2code.springboot.demo.tsm.dto;

import com.luv2code.springboot.demo.tsm.entity.enumerator.ProjectRole;
import jakarta.validation.constraints.NotNull;

public class AddMemberRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Role is required")
    private ProjectRole role;

    // Constructors
    public AddMemberRequest() {}

    public AddMemberRequest(Long userId, ProjectRole role) {
        this.userId = userId;
        this.role = role;
    }

    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public ProjectRole getRole() { return role; }
    public void setRole(ProjectRole role) { this.role = role; }
}

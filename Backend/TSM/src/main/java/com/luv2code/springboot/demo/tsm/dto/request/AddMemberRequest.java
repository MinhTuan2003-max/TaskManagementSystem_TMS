package com.luv2code.springboot.demo.tsm.dto.request;

import com.luv2code.springboot.demo.tsm.entity.enumerator.ProjectRole;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AddMemberRequest {

    // Getters and Setters
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

}

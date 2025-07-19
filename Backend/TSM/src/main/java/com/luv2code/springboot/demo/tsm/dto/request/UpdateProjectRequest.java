package com.luv2code.springboot.demo.tsm.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UpdateProjectRequest {

    // Getters and Setters
    @NotBlank(message = "Project name is required")
    @Size(max = 100, message = "Project name cannot exceed 100 characters")
    private String name;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    // Constructors
    public UpdateProjectRequest() {}

    public UpdateProjectRequest(String name, String description) {
        this.name = name;
        this.description = description;
    }

}

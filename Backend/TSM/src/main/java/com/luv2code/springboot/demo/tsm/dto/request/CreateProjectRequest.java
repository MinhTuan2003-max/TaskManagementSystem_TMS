// dto/request/CreateProjectRequest.java
package com.luv2code.springboot.demo.tsm.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Schema(description = "Request object for creating a new project")
public class CreateProjectRequest {

    // Getters and Setters
    @NotBlank(message = "Tên dự án không được để trống")
    @Size(min = 3, max = 100, message = "Tên dự án phải từ 3-100 ký tự")
    @Schema(description = "Project name", example = "Task Management System", required = true)
    private String name;

    @Size(max = 1000, message = "Mô tả không được quá 1000 ký tự")
    @Schema(description = "Project description", example = "A comprehensive task management system for teams")
    private String description;

    // Constructors
    public CreateProjectRequest() {}

    public CreateProjectRequest(String name, String description) {
        this.name = name;
        this.description = description;
    }

    @Override
    public String toString() {
        return "CreateProjectRequest{" +
                "name='" + name + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}

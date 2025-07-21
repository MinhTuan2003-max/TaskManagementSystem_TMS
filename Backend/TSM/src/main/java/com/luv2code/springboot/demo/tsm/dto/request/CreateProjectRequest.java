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

    @NotBlank(message = "Tên dự án không được để trống")
    @Size(min = 3, max = 100, message = "Tên dự án phải từ 3-100 ký tự")
    @Schema(description = "Project name", example = "Task Management System", required = true)
    private String name;

    @NotBlank(message = "Mô tả dự án không được để trống")
    @Size(min = 10, max = 1000, message = "Mô tả dự án phải từ 10-1000 ký tự")
    @Schema(description = "Project description", example = "A comprehensive task management system for teams")
    private String description;

    public CreateProjectRequest() {}

    public CreateProjectRequest(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public boolean isValid() {
        return name != null && !name.trim().isEmpty() && name.trim().length() >= 3 &&
                description != null && !description.trim().isEmpty() && description.trim().length() >= 10;
    }

    @Override
    public String toString() {
        return "CreateProjectRequest{" +
                "name='" + name + '\'' +
                ", nameLength=" + (name != null ? name.length() : "null") +
                ", description='" + description + '\'' +
                ", descriptionLength=" + (description != null ? description.length() : "null") +
                ", isValid=" + isValid() +
                '}';
    }
}

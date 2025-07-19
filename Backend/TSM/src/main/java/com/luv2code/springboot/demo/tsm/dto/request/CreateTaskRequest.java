package com.luv2code.springboot.demo.tsm.dto.request;

import com.luv2code.springboot.demo.tsm.entity.enumerator.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
public class CreateTaskRequest {

    // Getters and Setters
    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Priority is required")
    private Priority priority;

    private LocalDateTime deadline;

    @NotNull(message = "Project ID is required")
    private Long projectId;

    private Long assigneeId;

    // Constructors
    public CreateTaskRequest() {}

    public CreateTaskRequest(String title, String description, Priority priority,
                             LocalDateTime deadline, Long projectId, Long assigneeId) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.deadline = deadline;
        this.projectId = projectId;
        this.assigneeId = assigneeId;
    }

}

package com.luv2code.springboot.demo.tsm.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateCommentRequest {

    @NotBlank(message = "Content is required")
    private String content;

    @NotNull(message = "Task ID is required")
    private Long taskId;

    // Constructors
    public CreateCommentRequest() {}

    public CreateCommentRequest(String content, Long taskId) {
        this.content = content;
        this.taskId = taskId;
    }

    // Getters and Setters
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Long getTaskId() { return taskId; }
    public void setTaskId(Long taskId) { this.taskId = taskId; }
}

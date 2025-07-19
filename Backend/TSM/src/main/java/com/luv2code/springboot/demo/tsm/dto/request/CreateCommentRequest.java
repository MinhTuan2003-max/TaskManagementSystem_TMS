package com.luv2code.springboot.demo.tsm.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CreateCommentRequest {

    // Getters and Setters
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

}

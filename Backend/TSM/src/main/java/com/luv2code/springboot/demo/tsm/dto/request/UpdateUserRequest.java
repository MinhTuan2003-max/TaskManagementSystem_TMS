package com.luv2code.springboot.demo.tsm.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UpdateUserRequest {

    // Getters and Setters
    @NotBlank(message = "Full name is required")
    private String fullName;

    @Email(message = "Email should be valid")
    private String email;

    private String avatarUrl;

    // Constructors
    public UpdateUserRequest() {}

    public UpdateUserRequest(String fullName, String email, String avatarUrl) {
        this.fullName = fullName;
        this.email = email;
        this.avatarUrl = avatarUrl;
    }

}

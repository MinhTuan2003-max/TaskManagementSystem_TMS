package com.luv2code.springboot.demo.tsm.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class UpdateUserRequest {

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

    // Getters and Setters
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
}

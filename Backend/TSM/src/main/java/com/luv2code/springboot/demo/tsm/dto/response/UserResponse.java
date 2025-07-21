package com.luv2code.springboot.demo.tsm.dto.response;

import com.luv2code.springboot.demo.tsm.entity.User;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Setter
@Getter
public class UserResponse {
    // Getters and Setters
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String avatarUrl;
    private boolean enabled;
    private boolean accountNonExpired;
    private boolean accountNonLocked;
    private boolean credentialsNonExpired;
    private List<String> roles;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public UserResponse() {}
}

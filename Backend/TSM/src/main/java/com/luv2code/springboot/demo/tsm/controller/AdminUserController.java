package com.luv2code.springboot.demo.tsm.controller;

import com.luv2code.springboot.demo.tsm.dto.request.UpdateRoleRequest;
import com.luv2code.springboot.demo.tsm.dto.response.AdminUserStatsResponse;
import com.luv2code.springboot.demo.tsm.dto.response.MessageResponse;
import com.luv2code.springboot.demo.tsm.dto.response.ResetPasswordResponse;
import com.luv2code.springboot.demo.tsm.dto.response.UserResponse;
import com.luv2code.springboot.demo.tsm.entity.User;
import com.luv2code.springboot.demo.tsm.service.AdminUserService;
import com.luv2code.springboot.demo.tsm.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "http://localhost:4200")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    @Autowired
    private UserService userService;
    @Autowired
    private AdminUserService adminUserService;

    @GetMapping
    public ResponseEntity<PageResponse<UserResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<User> userPage = userService.findAll(pageable);

        List<UserResponse> userResponses = userPage.getContent().stream()
                .map(this::convertToUserResponse)
                .collect(Collectors.toList());

        PageResponse<UserResponse> response = new PageResponse<>();
        response.setContent(userResponses);
        response.setTotalElements(userPage.getTotalElements());
        response.setTotalPages(userPage.getTotalPages());
        response.setSize(userPage.getSize());
        response.setNumber(userPage.getNumber());
        response.setFirst(userPage.isFirst());
        response.setLast(userPage.isLast());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminUserStatsResponse> getUserStats() {
        AdminUserStatsResponse stats = userService.getAdminUserStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long userId) {
        User user = userService.findById(userId);
        UserResponse userResponse = convertToUserResponse(user);
        return ResponseEntity.ok(userResponse);
    }

    @PutMapping("/{userId}/lock")
    public ResponseEntity<MessageResponse> lockUser(@PathVariable Long userId) {
        userService.lockUser(userId);
        return ResponseEntity.ok(new MessageResponse("User locked successfully"));
    }

    @PutMapping("/{userId}/unlock")
    public ResponseEntity<MessageResponse> unlockUser(@PathVariable Long userId) {
        userService.unlockUser(userId);
        return ResponseEntity.ok(new MessageResponse("User unlocked successfully"));
    }

    @PutMapping("/{userId}/enable")
    public ResponseEntity<MessageResponse> enableUser(@PathVariable Long userId) {
        userService.updateUserStatus(userId, true);
        return ResponseEntity.ok(new MessageResponse("User enabled successfully"));
    }

    @PutMapping("/{userId}/disable")
    public ResponseEntity<MessageResponse> disableUser(@PathVariable Long userId) {
        userService.updateUserStatus(userId, false);
        return ResponseEntity.ok(new MessageResponse("User disabled successfully"));
    }

    @PutMapping("/{userId}/roles")
    public ResponseEntity<MessageResponse> updateUserRoles(
            @PathVariable Long userId,
            @RequestBody UpdateRoleRequest request) {
        userService.updateUserRoles(userId, request.getRoles());
        return ResponseEntity.ok(new MessageResponse("User roles updated successfully"));
    }

    @PostMapping("/{userId}/roles/{roleName}")
    public ResponseEntity<UserResponse> addRoleToUser(@PathVariable Long userId,
                                                      @PathVariable String roleName) {
        User user = adminUserService.addRoleToUser(userId, roleName);
        UserResponse response = convertToUserResponse(user);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{userId}/roles/{roleName}")
    public ResponseEntity<UserResponse> removeRoleFromUser(@PathVariable Long userId,
                                                           @PathVariable String roleName) {
        User user = adminUserService.removeRoleFromUser(userId, roleName);
        UserResponse response = convertToUserResponse(user);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{userId}/status")
    public ResponseEntity<UserResponse> updateUserStatus(@PathVariable Long userId,
                                                         @RequestParam boolean enabled) {
        User user = adminUserService.updateUserStatus(userId, enabled);
        UserResponse response = convertToUserResponse(user);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{userId}/reset-password")
    public ResponseEntity<ResetPasswordResponse> resetPassword(@PathVariable Long userId) {
        String tempPassword = userService.resetPassword(userId);
        return ResponseEntity.ok(new ResetPasswordResponse("Password reset successfully", tempPassword));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<MessageResponse> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok(new MessageResponse("User deleted successfully"));
    }

    // Helper method to convert User entity to UserResponse DTO
    private UserResponse convertToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setAvatarUrl(user.getAvatarUrl());
        response.setEnabled(user.isEnabled());
        response.setAccountNonExpired(user.isAccountNonExpired());
        response.setAccountNonLocked(user.isAccountNonLocked());
        response.setCredentialsNonExpired(user.isCredentialsNonExpired());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());

        List<String> roles = user.getRoles().stream()
                .map(role -> role.getName())
                .collect(Collectors.toList());
        response.setRoles(roles);

        return response;
    }

    // Inner classes for requests and responses
    public static class PageResponse<T> {
        private List<T> content;
        private long totalElements;
        private int totalPages;
        private int size;
        private int number;
        private boolean first;
        private boolean last;

        // Getters and Setters
        public List<T> getContent() { return content; }
        public void setContent(List<T> content) { this.content = content; }

        public long getTotalElements() { return totalElements; }
        public void setTotalElements(long totalElements) { this.totalElements = totalElements; }

        public int getTotalPages() { return totalPages; }
        public void setTotalPages(int totalPages) { this.totalPages = totalPages; }

        public int getSize() { return size; }
        public void setSize(int size) { this.size = size; }

        public int getNumber() { return number; }
        public void setNumber(int number) { this.number = number; }

        public boolean isFirst() { return first; }
        public void setFirst(boolean first) { this.first = first; }

        public boolean isLast() { return last; }
        public void setLast(boolean last) { this.last = last; }
    }
}

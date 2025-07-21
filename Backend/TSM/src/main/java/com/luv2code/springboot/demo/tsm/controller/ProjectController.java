package com.luv2code.springboot.demo.tsm.controller;

import com.luv2code.springboot.demo.tsm.dto.request.AddMemberRequest;
import com.luv2code.springboot.demo.tsm.dto.request.CreateProjectRequest;
import com.luv2code.springboot.demo.tsm.dto.request.UpdateProjectRequest;
import com.luv2code.springboot.demo.tsm.dto.response.ProjectStatsResponse;
import com.luv2code.springboot.demo.tsm.dto.response.UserResponse;
import com.luv2code.springboot.demo.tsm.entity.Project;
import com.luv2code.springboot.demo.tsm.entity.ProjectMember;
import com.luv2code.springboot.demo.tsm.entity.Role;
import com.luv2code.springboot.demo.tsm.entity.User;
import com.luv2code.springboot.demo.tsm.service.ProjectMemberService;
import com.luv2code.springboot.demo.tsm.service.ProjectService;
import jakarta.validation.Valid;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:4200")
public class ProjectController {

    @Autowired
    private ProjectService projectService;
    @Autowired
    private ProjectMemberService projectMemberService;

    @PostMapping
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Project> createProject(@Valid @RequestBody CreateProjectRequest request,
                                                 Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Project project = projectService.createProject(request.getName(), request.getDescription(), user.getId());
        return ResponseEntity.ok(project);
    }

    // Tất cả authenticated users có thể xem stats
    @GetMapping("/{projectId}/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<ProjectStatsResponse> getProjectStats(@PathVariable Long projectId) {
        ProjectStatsResponse stats = projectService.getProjectStats(projectId);
        return ResponseEntity.ok(stats);
    }

    // Chỉ Owner/Manager có thể update dự án
    @PutMapping("/{projectId}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Project> updateProject(@PathVariable Long projectId,
                                                 @Valid @RequestBody UpdateProjectRequest request,
                                                 Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Project project = projectService.updateProject(projectId, request, user.getId());
        return ResponseEntity.ok(project);
    }

    // Chỉ Owner/Manager có thể xóa dự án
    @DeleteMapping("/{projectId}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProject(@PathVariable Long projectId) {
        projectService.deleteProject(projectId);
        return ResponseEntity.noContent().build();
    }

    // Tất cả authenticated users có thể xem chi tiết dự án
    @GetMapping("/{projectId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<Project> getProject(@PathVariable Long projectId) {
        Project project = projectService.findById(projectId);
        return ResponseEntity.ok(project);
    }

    @GetMapping("/my-projects")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<List<Project>> getMyProjects(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Project> projects = projectService.getAllUserProjects(user.getId());
        return ResponseEntity.ok(projects);
    }

    @PostMapping("/{projectId}/members")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<ProjectMember> addMember(@PathVariable Long projectId,
                                                   @Valid @RequestBody AddMemberRequest request,
                                                   Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        ProjectMember member = projectMemberService.addMemberToProject(
                projectId,
                request.getUserId(),
                request.getRole(),
                currentUser.getId()
        );
        return ResponseEntity.ok(member);
    }

    @GetMapping("/{projectId}/available-users")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<UserResponse>> getAvailableUsersForProject(@PathVariable Long projectId) {
        List<User> availableUsers = projectService.getAvailableUsersForProject(projectId);
        List<UserResponse> response = availableUsers.stream()
                .map(this::convertToUserResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    private UserResponse convertToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setAvatarUrl(user.getAvatarUrl());
        response.setEnabled(user.isEnabled());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());

        List<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());
        response.setRoles(roles);

        return response;
    }
}

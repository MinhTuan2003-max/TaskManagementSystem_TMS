package com.luv2code.springboot.demo.tsm.controller;

import com.luv2code.springboot.demo.tsm.dto.request.CreateProjectRequest;
import com.luv2code.springboot.demo.tsm.dto.request.UpdateProjectRequest;
import com.luv2code.springboot.demo.tsm.dto.response.ProjectStatsResponse;
import com.luv2code.springboot.demo.tsm.entity.Project;
import com.luv2code.springboot.demo.tsm.entity.User;
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

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:4200")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

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
    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('ADMIN')")
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
    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Project> getProject(@PathVariable Long projectId) {
        Project project = projectService.findById(projectId);
        return ResponseEntity.ok(project);
    }

    @GetMapping("/my-projects")
    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<Project>> getMyProjects(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Project> projects = projectService.getAllUserProjects(user.getId());
        return ResponseEntity.ok(projects);
    }

}

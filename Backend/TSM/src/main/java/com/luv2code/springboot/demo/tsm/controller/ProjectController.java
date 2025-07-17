package com.luv2code.springboot.demo.tsm.controller;

import com.luv2code.springboot.demo.tsm.entity.Project;
import com.luv2code.springboot.demo.tsm.entity.User;
import com.luv2code.springboot.demo.tsm.service.ProjectService;
import jakarta.validation.Valid;
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
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Project> createProject(@Valid @RequestBody CreateProjectRequest request,
                                                 Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Project project = projectService.createProject(request.getName(), request.getDescription(), user.getId());
        return ResponseEntity.ok(project);
    }

    @PutMapping("/{projectId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Project> updateProject(@PathVariable Long projectId,
                                                 @Valid @RequestBody CreateProjectRequest request) {
        Project project = projectService.updateProject(projectId, request.getName(), request.getDescription());
        return ResponseEntity.ok(project);
    }

    @DeleteMapping("/{projectId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProject(@PathVariable Long projectId) {
        projectService.deleteProject(projectId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{projectId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Project> getProject(@PathVariable Long projectId) {
        Project project = projectService.findById(projectId);
        return ResponseEntity.ok(project);
    }

    @GetMapping("/my-projects")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Project>> getMyProjects(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Project> projects = projectService.getAllUserProjects(user.getId());
        return ResponseEntity.ok(projects);
    }

    // Inner class for request body
    public static class CreateProjectRequest {
        private String name;
        private String description;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }
}

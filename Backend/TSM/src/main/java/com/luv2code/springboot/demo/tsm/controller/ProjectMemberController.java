package com.luv2code.springboot.demo.tsm.controller;

import com.luv2code.springboot.demo.tsm.dto.request.AddMemberRequest;
import com.luv2code.springboot.demo.tsm.entity.ProjectMember;
import com.luv2code.springboot.demo.tsm.entity.enumerator.ProjectRole;
import com.luv2code.springboot.demo.tsm.service.ProjectMemberService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects/{projectId}/members")
@CrossOrigin(origins = "http://localhost:4200")
public class ProjectMemberController {

    @Autowired
    private ProjectMemberService projectMemberService;

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ProjectMember> addMember(@PathVariable Long projectId,
                                                   @Valid @RequestBody AddMemberRequest request) {
        ProjectMember member = projectMemberService.addMemberToProject(projectId, request.getUserId(), request.getRole());
        return ResponseEntity.ok(member);
    }

    @PutMapping("/{userId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ProjectMember> updateMemberRole(@PathVariable Long projectId,
                                                          @PathVariable Long userId,
                                                          @RequestBody Map<String, ProjectRole> request) {
        ProjectRole newRole = request.get("role");
        ProjectMember member = projectMemberService.updateMemberRole(projectId, userId, newRole);
        return ResponseEntity.ok(member);
    }

    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Void> removeMember(@PathVariable Long projectId,
                                             @PathVariable Long userId) {
        projectMemberService.removeMemberFromProject(projectId, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<ProjectMember>> getProjectMembers(@PathVariable Long projectId) {
        List<ProjectMember> members = projectMemberService.getProjectMembers(projectId);
        return ResponseEntity.ok(members);
    }

    @GetMapping("/admins")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<ProjectMember>> getProjectAdmins(@PathVariable Long projectId) {
        List<ProjectMember> admins = projectMemberService.getProjectAdmins(projectId);
        return ResponseEntity.ok(admins);
    }
}

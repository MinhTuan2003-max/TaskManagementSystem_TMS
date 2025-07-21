package com.luv2code.springboot.demo.tsm.controller;

import com.luv2code.springboot.demo.tsm.dto.request.AddMemberRequest;
import com.luv2code.springboot.demo.tsm.entity.ProjectMember;
import com.luv2code.springboot.demo.tsm.entity.User;
import com.luv2code.springboot.demo.tsm.entity.enumerator.ProjectRole;
import com.luv2code.springboot.demo.tsm.service.ProjectMemberService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects/{projectId}/members")
@CrossOrigin(origins = "http://localhost:4200")
public class ProjectMemberController {

    @Autowired
    private ProjectMemberService projectMemberService;

    // Chỉ Manager có thể mời thành viên
    @PostMapping
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

    // Chỉ Manager có thể cập nhật vai trò thành viên
    @PutMapping("/{userId}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<ProjectMember> updateMemberRole(@PathVariable Long projectId,
                                                          @PathVariable Long userId,
                                                          @RequestBody Map<String, ProjectRole> request) {
        ProjectRole newRole = request.get("role");
        ProjectMember member = projectMemberService.updateMemberRole(projectId, userId, newRole);
        return ResponseEntity.ok(member);
    }

    // Chỉ Manager có thể xóa thành viên
    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Void> removeMember(@PathVariable Long projectId,
                                             @PathVariable Long userId) {
        projectMemberService.removeMemberFromProject(projectId, userId);
        return ResponseEntity.noContent().build();
    }

    // Tất cả thành viên dự án có thể xem danh sách (bao gồm User)
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<List<ProjectMember>> getProjectMembers(@PathVariable Long projectId) {
        List<ProjectMember> members = projectMemberService.getProjectMembers(projectId);
        return ResponseEntity.ok(members);
    }

    // Chỉ Manager có thể xem danh sách admin
    @GetMapping("/admins")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<ProjectMember>> getProjectAdmins(@PathVariable Long projectId) {
        List<ProjectMember> admins = projectMemberService.getProjectAdmins(projectId);
        return ResponseEntity.ok(admins);
    }
}

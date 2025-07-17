package com.luv2code.springboot.demo.tsm.service;

import com.luv2code.springboot.demo.tsm.entity.Project;
import com.luv2code.springboot.demo.tsm.entity.ProjectMember;
import com.luv2code.springboot.demo.tsm.entity.enumerator.ProjectRole;
import com.luv2code.springboot.demo.tsm.entity.User;
import com.luv2code.springboot.demo.tsm.repository.ProjectMemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProjectMemberService {

    @Autowired
    private ProjectMemberRepository projectMemberRepository;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private UserService userService;

    public ProjectMember addMemberToProject(Long projectId, Long userId, ProjectRole role) {
        Project project = projectService.findById(projectId);
        User user = userService.findById(userId);

        // Check if user is already a member
        if (projectMemberRepository.existsByProjectIdAndUserId(projectId, userId)) {
            throw new RuntimeException("User is already a member of this project");
        }

        ProjectMember member = new ProjectMember(project, user, role);
        return projectMemberRepository.save(member);
    }

    public ProjectMember updateMemberRole(Long projectId, Long userId, ProjectRole newRole) {
        ProjectMember member = projectMemberRepository.findByProjectIdAndUserId(projectId, userId)
                .orElseThrow(() -> new RuntimeException("Member not found in this project"));

        member.setRole(newRole);
        return projectMemberRepository.save(member);
    }

    public void removeMemberFromProject(Long projectId, Long userId) {
        if (!projectMemberRepository.existsByProjectIdAndUserId(projectId, userId)) {
            throw new RuntimeException("User is not a member of this project");
        }

        projectMemberRepository.deleteByProjectIdAndUserId(projectId, userId);
    }

    public List<ProjectMember> getProjectMembers(Long projectId) {
        return projectMemberRepository.findByProjectIdWithUser(projectId);
    }

    public List<ProjectMember> getUserProjects(Long userId) {
        return projectMemberRepository.findByUserIdWithProject(userId);
    }

    public Optional<ProjectMember> getProjectMember(Long projectId, Long userId) {
        return projectMemberRepository.findByProjectIdAndUserId(projectId, userId);
    }

    public boolean isUserMemberOfProject(Long projectId, Long userId) {
        return projectMemberRepository.existsByProjectIdAndUserId(projectId, userId);
    }

    public List<ProjectMember> getProjectAdmins(Long projectId) {
        return projectMemberRepository.findByProjectIdAndRole(projectId, ProjectRole.ADMIN);
    }
}

package com.luv2code.springboot.demo.tsm.service;

import com.luv2code.springboot.demo.tsm.dto.request.UpdateProjectRequest;
import com.luv2code.springboot.demo.tsm.dto.response.ProjectStatsResponse;
import com.luv2code.springboot.demo.tsm.entity.Project;
import com.luv2code.springboot.demo.tsm.entity.ProjectMember;
import com.luv2code.springboot.demo.tsm.entity.User;
import com.luv2code.springboot.demo.tsm.entity.enumerator.TaskStatus;
import com.luv2code.springboot.demo.tsm.repository.ProjectMemberRepository;
import com.luv2code.springboot.demo.tsm.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private NotificationService notificationService;
    @Autowired
    private ProjectMemberRepository projectMemberRepository;

    public Project createProject(String name, String description, Long ownerId) {
        User owner = userService.findById(ownerId);

        Project project = new Project();
        project.setName(name);
        project.setDescription(description);
        project.setOwner(owner);

        return projectRepository.save(project);
    }

    public Project updateProject(Long projectId, UpdateProjectRequest request, Long userId) {
        Project project = findById(projectId);
        User actor = userService.findById(userId);

        project.setName(request.getName());
        project.setDescription(request.getDescription());

        Project updatedProject = projectRepository.save(project);

        // Tạo notification
        notificationService.createProjectUpdatedNotification(updatedProject, actor);

        return updatedProject;
    }

    public void deleteProject(Long projectId) {
        Project project = findById(projectId);
        projectRepository.delete(project);
    }

    public Project findById(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));
    }

    public List<Project> getProjectsByOwner(Long ownerId) {
        return projectRepository.findByOwnerIdOrderByCreatedAtDesc(ownerId);
    }

    public ProjectStatsResponse getProjectStats(Long projectId) {
        try {
            Project project = findById(projectId);

            if (project == null) {
                throw new RuntimeException("Project not found: " + projectId);
            }

            int totalTasks = project.getTasks() != null ? project.getTasks().size() : 0;
            int completedTasks = project.getTasks() != null ?
                    (int) project.getTasks().stream()
                            .filter(task -> task.getStatus() == TaskStatus.DONE)
                            .count() : 0;
            int inProgressTasks = project.getTasks() != null ?
                    (int) project.getTasks().stream()
                            .filter(task -> task.getStatus() == TaskStatus.IN_PROGRESS)
                            .count() : 0;
            int overdueTasks = project.getTasks() != null ?
                    (int) project.getTasks().stream()
                            .filter(task -> task.getDeadline() != null &&
                                    task.getDeadline().isBefore(LocalDateTime.now()) &&
                                    task.getStatus() != TaskStatus.DONE)
                            .count() : 0;
            int activeMembers = project.getMembers() != null ? project.getMembers().size() : 0;

            return new ProjectStatsResponse(totalTasks, completedTasks,
                    inProgressTasks, overdueTasks, activeMembers);

        } catch (Exception e) {
            System.err.println("Error calculating project stats for project " + projectId + ": " + e.getMessage());
            throw new RuntimeException("Failed to calculate project stats", e);
        }
    }

    public List<User> getAvailableUsersForProject(Long projectId) {
        List<User> allUsers = userService.findAll().stream()
                .filter(User::isEnabled)
                .collect(Collectors.toList());

        List<ProjectMember> currentMembers = projectMemberRepository.findByProjectIdOrderByJoinedAtDesc(projectId);

        Set<Long> memberUserIds = currentMembers.stream()
                .map(member -> member.getUser().getId())
                .collect(Collectors.toSet());
        return allUsers.stream()
                .filter(user -> !memberUserIds.contains(user.getId()))
                .collect(Collectors.toList());
    }

    public List<Project> getAllUserProjects(Long userId) {
        return projectRepository.findAllUserProjects(userId);
    }

    public List<Project> getManagedProjects(Long userId) {
        // Assuming you have a query in ProjectRepository to get projects where user is manager
        return projectRepository.findProjectsManagedByUser(userId);
    }
}
package com.luv2code.springboot.demo.tsm.service;

import com.luv2code.springboot.demo.tsm.entity.Project;
import com.luv2code.springboot.demo.tsm.entity.User;
import com.luv2code.springboot.demo.tsm.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserService userService;

    public Project createProject(String name, String description, Long ownerId) {
        User owner = userService.findById(ownerId);

        Project project = new Project();
        project.setName(name);
        project.setDescription(description);
        project.setOwner(owner);

        return projectRepository.save(project);
    }

    public Project updateProject(Long projectId, String name, String description) {
        Project project = findById(projectId);
        project.setName(name);
        project.setDescription(description);
        return projectRepository.save(project);
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

    public List<Project> getAllUserProjects(Long userId) {
        return projectRepository.findAllUserProjects(userId);
    }
}

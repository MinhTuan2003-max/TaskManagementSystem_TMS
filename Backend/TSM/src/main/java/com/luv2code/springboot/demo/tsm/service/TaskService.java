package com.luv2code.springboot.demo.tsm.service;

import com.luv2code.springboot.demo.tsm.dto.request.CreateTaskRequest;
import com.luv2code.springboot.demo.tsm.dto.KanbanBoard;
import com.luv2code.springboot.demo.tsm.entity.Project;
import com.luv2code.springboot.demo.tsm.entity.Task;
import com.luv2code.springboot.demo.tsm.entity.enumerator.TaskStatus;
import com.luv2code.springboot.demo.tsm.entity.User;
import com.luv2code.springboot.demo.tsm.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ProjectService projectService;
    @Autowired
    private NotificationService notificationService;
    @Autowired
    private ProjectMemberService projectMemberService;

    public Task createTask(CreateTaskRequest request, Long creatorId) {
        User creator = userService.findById(creatorId);
        Project project = projectService.findById(request.getProjectId());

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority());
        task.setDeadline(request.getDeadline());
        task.setProject(project);
        task.setCreator(creator);

        if (request.getAssigneeId() != null) {
            User assignee = userService.findById(request.getAssigneeId());
            task.setAssignee(assignee);
        }

        Task savedTask = taskRepository.save(task);

        if (savedTask.getAssignee() != null) {
            notificationService.createTaskAssignedNotification(savedTask, creator);
        }

        return savedTask;
    }

    public Task updateTask(Long taskId, CreateTaskRequest request, Long userId) {
        Task task = findById(taskId);

        // Security check: Kiểm tra quyền chỉnh sửa
        if (!canManageTask(task, userId)) {
            throw new AccessDeniedException("Không có quyền chỉnh sửa task này");
        }

        // Update task fields
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority());
        task.setDeadline(request.getDeadline());

        // Update assignee if provided
        if (request.getAssigneeId() != null) {
            User assignee = userService.findById(request.getAssigneeId());
            task.setAssignee(assignee);

            notificationService.createTaskAssignedNotification(task, assignee);
        }

        return taskRepository.save(task);
    }

    public Task updateTaskStatus(Long taskId, TaskStatus newStatus, Long userId) {
        Task task = findById(taskId);
        TaskStatus oldStatus = task.getStatus();

        task.setStatus(newStatus);
        Task updatedTask = taskRepository.save(task);

        task.setStatus(newStatus);
        User actor = userService.findById(userId);
        notificationService.createTaskStatusChangedNotification(updatedTask, actor, oldStatus);

        // Nếu task completed, tạo notification riêng
        if (newStatus == TaskStatus.DONE && oldStatus != TaskStatus.DONE) {
            notificationService.createTaskCompletedNotification(updatedTask, actor);
        }

        return updatedTask;
    }

    public void deleteTask(Long taskId, Long userId) {
        Task task = findById(taskId);

        // Security check: Kiểm tra quyền xóa
        if (!canManageTask(task, userId)) {
            throw new AccessDeniedException("Không có quyền xóa task này");
        }

        taskRepository.delete(task);
    }

    private boolean canManageTask(Task task, Long userId) {
        if (task.getCreator().getId().equals(userId)) {
            return true;
        }

        if (task.getProject().getOwner().getId().equals(userId)) {
            return true;
        }

        return projectMemberService.isUserProjectManager(task.getProject().getId(), userId);
    }

    public Task findById(Long taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));
    }

    public List<Task> getTasksByProject(Long projectId) {
        return taskRepository.findByProjectIdOrderByCreatedAtDesc(projectId);
    }

    public KanbanBoard getKanbanBoard(Long projectId) {
        List<Task> allTasks = taskRepository.findByProjectIdWithAssigneeAndCreator(projectId);

        List<Task> todoTasks = allTasks.stream()
                .filter(task -> task.getStatus() == TaskStatus.TODO)
                .collect(Collectors.toList());

        List<Task> inProgressTasks = allTasks.stream()
                .filter(task -> task.getStatus() == TaskStatus.IN_PROGRESS)
                .collect(Collectors.toList());

        List<Task> doneTasks = allTasks.stream()
                .filter(task -> task.getStatus() == TaskStatus.DONE)
                .collect(Collectors.toList());

        return new KanbanBoard(todoTasks, inProgressTasks, doneTasks);
    }

    public List<Task> getTasksByAssignee(Long assigneeId) {
        return taskRepository.findByAssigneeIdAndStatusOrderByDeadlineAsc(assigneeId, TaskStatus.TODO);
    }
}

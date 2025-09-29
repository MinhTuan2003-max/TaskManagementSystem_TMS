package com.luv2code.springboot.demo.tsm.service;

import com.luv2code.springboot.demo.tsm.dto.request.CreateCommentRequest;
import com.luv2code.springboot.demo.tsm.dto.request.CreateTaskRequest;
import com.luv2code.springboot.demo.tsm.dto.KanbanBoard;
import com.luv2code.springboot.demo.tsm.entity.Comment;
import com.luv2code.springboot.demo.tsm.entity.Project;
import com.luv2code.springboot.demo.tsm.entity.Task;
import com.luv2code.springboot.demo.tsm.entity.User;
import com.luv2code.springboot.demo.tsm.entity.enumerator.TaskStatus;
import com.luv2code.springboot.demo.tsm.entity.enumerator.Priority;
import com.luv2code.springboot.demo.tsm.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class TaskService {

    @Autowired private TaskRepository taskRepository;
    @Autowired private UserService userService;
    @Autowired private ProjectService projectService;
    @Autowired private NotificationService notificationService;
    @Autowired private ProjectMemberService projectMemberService;
    @Autowired private CommentService commentService;

    /**
     * Workflow trạng thái task bắt buộc theo luồng:
     * TODO -> IN_PROGRESS -> REVIEW -> DONE
     */
    private static final Map<TaskStatus, TaskStatus> STATUS_FLOW = new LinkedHashMap<>();
    static {
        STATUS_FLOW.put(TaskStatus.TODO, TaskStatus.IN_PROGRESS);
        STATUS_FLOW.put(TaskStatus.IN_PROGRESS, TaskStatus.REVIEW);
        STATUS_FLOW.put(TaskStatus.REVIEW, TaskStatus.DONE);
        STATUS_FLOW.put(TaskStatus.DONE, TaskStatus.DONE);
    }

    // Tạo task - chỉ role Manager/Owner/Admin
    public Task createTask(CreateTaskRequest request, Long creatorId) {
        User creator = userService.findById(creatorId);
        Project project = projectService.findById(request.getProjectId());

        if (!isOwnerOrManager(creatorId, project)) {
            throw new AccessDeniedException("Không có quyền tạo task cho dự án này");
        }

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority() != null ? request.getPriority() : Priority.MEDIUM);
        task.setDeadline(request.getDeadline());
        task.setProject(project);
        task.setCreator(creator);
        task.setStatus(TaskStatus.TODO); // Mặc định trạng thái khi tạo task

        if (request.getAssigneeId() != null) {
            User assignee = userService.findById(request.getAssigneeId());
            task.setAssignee(assignee);
        }

        Task saved = taskRepository.save(task);

        if (saved.getAssignee() != null) {
            notificationService.createTaskAssignedNotification(saved, creator);
        }

        return saved;
    }

    // Update task thông tin và gán nhiệm vụ - chỉ Manager/Owner/Admin
    public Task updateTask(Long taskId, CreateTaskRequest request, Long userId) {
        Task task = findById(taskId);

        if (!isOwnerOrManager(userId, task.getProject())) {
            throw new AccessDeniedException("Không có quyền chỉnh sửa task này");
        }

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority() != null ? request.getPriority() : task.getPriority());
        task.setDeadline(request.getDeadline());

        if (request.getAssigneeId() != null) {
            User newAssignee = userService.findById(request.getAssigneeId());
            if (task.getAssignee() == null || !task.getAssignee().getId().equals(newAssignee.getId())) {
                task.setAssignee(newAssignee);
                notificationService.createTaskAssignedNotification(task, userService.findById(userId));
            }
        } else {
            // Nếu có yêu cầu, có thể bỏ gán assignee
            task.setAssignee(null);
        }
        return taskRepository.save(task);
    }

    // Member và Manager cập nhật trạng thái task theo workflow
    public Task updateTaskStatus(Long taskId, TaskStatus newStatus, Long userId) {
        Task task = findById(taskId);

        // Phân quyền: member chỉ update task được giao, manager/owner update tất cả task trong project, admin có toàn quyền
        if (!(isTaskAssignee(userId, task) || isOwnerOrManager(userId, task.getProject()) || isAdmin(userId))) {
            throw new AccessDeniedException("Không có quyền cập nhật trạng thái task này");
        }

        TaskStatus currentStatus = task.getStatus();
        TaskStatus expectedNextStatus = STATUS_FLOW.get(currentStatus);

        if (expectedNextStatus == null) {
            throw new IllegalArgumentException("Trạng thái hiện tại không hợp lệ");
        }

        // Cho phép giữ nguyên trạng thái DONE hoặc chuyển đúng trạng thái tiếp theo
        if (!newStatus.equals(expectedNextStatus) && !(currentStatus == TaskStatus.DONE && newStatus == TaskStatus.DONE)) {
            throw new IllegalArgumentException("Trạng thái mới không hợp lệ. Phải theo trình tự workflow.");
        }

        task.setStatus(newStatus);
        Task updated = taskRepository.save(task);

        User actor = userService.findById(userId);
        notificationService.createTaskStatusChangedNotification(updated, actor, currentStatus);

        if (newStatus == TaskStatus.DONE && currentStatus != TaskStatus.DONE) {
            notificationService.createTaskCompletedNotification(updated, actor);
        }
        return updated;
    }

    // Xóa task - chỉ owner/manager/admin
    public void deleteTask(Long taskId, Long userId) {
        Task task = findById(taskId);

        if (!isOwnerOrManager(userId, task.getProject())) {
            throw new AccessDeniedException("Không có quyền xóa task này");
        }

        taskRepository.delete(task);
    }

    // Gán task mới (assign) - chỉ owner/manager/admin
    public Task assignTask(Long taskId, Long assigneeId, Long currentUserId) {
        Task task = findById(taskId);

        if (!isOwnerOrManager(currentUserId, task.getProject())) {
            throw new AccessDeniedException("Không có quyền giao task này");
        }

        User assignee = userService.findById(assigneeId);
        task.setAssignee(assignee);
        Task saved = taskRepository.save(task);

        notificationService.createTaskAssignedNotification(saved, userService.findById(currentUserId));

        return saved;
    }

    private Priority parsePrioritySafely(String str) {
        try {
            return Priority.valueOf(str.toUpperCase());
        } catch (Exception e) {
            return null;
        }
    }

    // Tìm kiếm task theo nhiều tiêu chí, phân quyền cũng áp dụng
    public List<Task> searchTasks(String keyword, TaskStatus status, String priorityStr,
                                  Long assigneeId, Long projectId, Long currentUserId) {
        final Priority priority = (priorityStr != null) ?
                parsePrioritySafely(priorityStr) : null;

        List<Task> baseTasks;
        if (projectId != null) {
            baseTasks = taskRepository.findByProjectId(projectId);
        } else {
            baseTasks = getAccessibleTasks(currentUserId);
        }

        return baseTasks.stream()
                .filter(t -> matchesSearchCriteria(t, keyword, status, priority, assigneeId))
                .collect(Collectors.toList());
    }

    private List<Task> getAccessibleTasks(Long userId) {
        User user = userService.findById(userId);
        if (isAdmin(userId)) {
            return taskRepository.findAll();
        }

        if (isOwnerOrManager(userId)) {
            List<Long> managedProjectIds = projectService.getManagedProjects(userId).stream()
                    .map(Project::getId).collect(Collectors.toList());
            return taskRepository.findByProjectIdIn(managedProjectIds);
        }

        return taskRepository.findByAssigneeId(userId);
    }

    private boolean matchesSearchCriteria(Task task, String keyword, TaskStatus status, Priority priority, Long assigneeId) {
        if (keyword != null && !keyword.trim().isEmpty()) {
            String lw = keyword.toLowerCase();
            boolean titleMatch = task.getTitle().toLowerCase().contains(lw);
            boolean descMatch = task.getDescription() != null && task.getDescription().toLowerCase().contains(lw);
            if (!titleMatch && !descMatch) {
                return false;
            }
        }

        if (status != null && !task.getStatus().equals(status)) {
            return false;
        }

        if (priority != null && !task.getPriority().equals(priority)) {
            return false;
        }

        if (assigneeId != null) {
            if (task.getAssignee() == null || !task.getAssignee().getId().equals(assigneeId)) {
                return false;
            }
        }

        return true;
    }

    private boolean isOwnerOrManager(Long userId) {
        // Đơn giản kiểm tra role Admin hoặc Manager
        User user = userService.findById(userId);
        return isAdmin(userId) || isManager(user);
    }

    private boolean isOwnerOrManager(Long userId, Project project) {
        if (project.getOwner() != null && project.getOwner().getId().equals(userId)) {
            return true;
        }
        return projectMemberService.isUserProjectManager(userId, project.getId()) || isAdmin(userId);
    }

    private boolean isTaskAssignee(Long userId, Task task) {
        return task.getAssignee() != null && task.getAssignee().getId().equals(userId);
    }

    private boolean isAdmin(Long userId) {
        User user = userService.findById(userId);
        return user.getRoles().stream()
                .anyMatch(r -> r.getName().equals("ROLE_ADMIN"));
    }

    private boolean isManager(User user) {
        return user.getRoles().stream()
                .anyMatch(r -> r.getName().equals("ROLE_MANAGER"));
    }

    public Task findById(Long taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
    }

    public List<Task> getTasksByProject(Long projectId) {
        return taskRepository.findByProjectIdOrderByCreatedAtDesc(projectId);
    }

    public KanbanBoard getKanbanBoard(Long projectId) {
        List<Task> allTasks = taskRepository.findByProjectIdWithAssigneeAndCreator(projectId);

        List<Task> todoTasks = allTasks.stream().filter(t -> t.getStatus() == TaskStatus.TODO).collect(Collectors.toList());
        List<Task> inProgressTasks = allTasks.stream().filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS).collect(Collectors.toList());
        List<Task> reviewTasks = allTasks.stream().filter(t -> t.getStatus() == TaskStatus.REVIEW).collect(Collectors.toList());
        List<Task> doneTasks = allTasks.stream().filter(t -> t.getStatus() == TaskStatus.DONE).collect(Collectors.toList());

        return new KanbanBoard(todoTasks, inProgressTasks, reviewTasks, doneTasks);
    }

    public List<Task> getTasksByAssignee(Long assigneeId) {
        return taskRepository.findByAssigneeIdAndStatusOrderByDeadlineAsc(assigneeId, TaskStatus.TODO);
    }

    //add comment
    public Comment addComment(Long taskId, String content, Long authorId) {
        Task task = taskRepository.findById(taskId).orElse(null);
        if (task == null) {
            throw new RuntimeException("Task not found");
        }
        Comment comment = new Comment();
        comment.setContent(content);
        comment.setAuthor(userService.findById(authorId));
        comment.setTask(task);
        return commentService.saveComment(comment);
    }

}

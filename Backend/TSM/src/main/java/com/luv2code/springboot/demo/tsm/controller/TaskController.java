package com.luv2code.springboot.demo.tsm.controller;

import com.luv2code.springboot.demo.tsm.dto.request.CreateTaskRequest;
import com.luv2code.springboot.demo.tsm.dto.KanbanBoard;
import com.luv2code.springboot.demo.tsm.entity.Comment;
import com.luv2code.springboot.demo.tsm.entity.Task;
import com.luv2code.springboot.demo.tsm.entity.enumerator.TaskStatus;
import com.luv2code.springboot.demo.tsm.entity.User;
import com.luv2code.springboot.demo.tsm.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:4200")
public class TaskController {

    @Autowired
    private TaskService taskService;

    // Chỉ Manager/Admin có thể tạo task (theo sơ đồ phân quyền)
    @PostMapping
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Task> createTask(@Valid @RequestBody CreateTaskRequest request,
                                           Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Task task = taskService.createTask(request, user.getId());
        return ResponseEntity.ok(task);
    }

    // Chỉ Manager/Admin có thể update task
    @PutMapping("/{taskId}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Task> updateTask(@PathVariable Long taskId,
                                           @Valid @RequestBody CreateTaskRequest request,
                                           Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Task task = taskService.updateTask(taskId, request, user.getId());
        return ResponseEntity.ok(task);
    }

    // Tất cả authenticated users có thể update task status (User có thể update trạng thái task được assign)
    @PutMapping("/{taskId}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<Task> updateTaskStatus(@PathVariable Long taskId,
                                                 @RequestBody Map<String, TaskStatus> request,
                                                 Authentication authentication) {
        TaskStatus status = request.get("status");
        User currentUser = (User) authentication.getPrincipal();
        Task task = taskService.updateTaskStatus(taskId, status, currentUser.getId());
        return ResponseEntity.ok(task);
    }

    // Chỉ Manager/Admin có thể xóa task
    @DeleteMapping("/{taskId}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId,
                                           Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        taskService.deleteTask(taskId, user.getId());
        return ResponseEntity.noContent().build();
    }

    // Tất cả authenticated users có thể xem chi tiết task
    @GetMapping("/{taskId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<Task> getTask(@PathVariable Long taskId) {
        Task task = taskService.findById(taskId);
        return ResponseEntity.ok(task);
    }

    // Tất cả authenticated users có thể xem tasks by project
    @GetMapping("/project/{projectId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<List<Task>> getTasksByProject(@PathVariable Long projectId) {
        List<Task> tasks = taskService.getTasksByProject(projectId);
        return ResponseEntity.ok(tasks);
    }

    // Tất cả authenticated users có thể xem Kanban board
    @GetMapping("/project/{projectId}/kanban")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<KanbanBoard> getKanbanBoard(@PathVariable Long projectId) {
        KanbanBoard board = taskService.getKanbanBoard(projectId);
        return ResponseEntity.ok(board);
    }

    // Tất cả authenticated users có thể xem tasks của mình
    @GetMapping("/my-tasks")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<List<Task>> getMyTasks(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Task> tasks = taskService.getTasksByAssignee(user.getId());
        return ResponseEntity.ok(tasks);
    }

    @PutMapping("/{taskId}/assign")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Task> assignTask(@PathVariable Long taskId,
                                           @RequestBody Map<String, Long> assignRequest,
                                           Authentication authentication) {
        Long assigneeId = assignRequest.get("assigneeId");
        User currentUser = (User) authentication.getPrincipal();
        Task task = taskService.assignTask(taskId, assigneeId, currentUser.getId());
        return ResponseEntity.ok(task);
    }


    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<List<Task>> searchTasks(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) Long assigneeId,
            @RequestParam(required = false) Long projectId,
            Authentication authentication) {

        User currentUser = (User) authentication.getPrincipal();
        List<Task> tasks = taskService.searchTasks(keyword, status, priority, assigneeId, projectId, currentUser.getId());
        return ResponseEntity.ok(tasks);
    }

    @PostMapping("/{taskId}/comments")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<Comment> addComment(@PathVariable Long taskId,
                                              @RequestBody Map<String, String> request,
                                              Authentication authentication) {
        String content = request.get("content");
        User currentUser = (User) authentication.getPrincipal();
        Comment comment = taskService.addComment(taskId, content, currentUser.getId());
        return ResponseEntity.ok(comment);
    }


}

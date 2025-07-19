package com.luv2code.springboot.demo.tsm.controller;

import com.luv2code.springboot.demo.tsm.dto.request.CreateTaskRequest;
import com.luv2code.springboot.demo.tsm.dto.KanbanBoard;
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

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Task> createTask(@Valid @RequestBody CreateTaskRequest request,
                                           Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Task task = taskService.createTask(request, user.getId());
        return ResponseEntity.ok(task);
    }

    @PutMapping("/{taskId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Task> updateTask(@PathVariable Long taskId,
                                           @Valid @RequestBody CreateTaskRequest request) {
        Task task = taskService.updateTask(taskId, request);
        return ResponseEntity.ok(task);
    }

    @PutMapping("/{taskId}/status")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Task> updateTaskStatus(@PathVariable Long taskId,
                                                 @RequestBody Map<String, TaskStatus> request,
                                                 Authentication authentication) {
        TaskStatus status = request.get("status");
        User currentUser = (User) authentication.getPrincipal();
        Task task = taskService.updateTaskStatus(taskId, status, currentUser.getId());
        return ResponseEntity.ok(task);
    }


    @DeleteMapping("/{taskId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId) {
        taskService.deleteTask(taskId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{taskId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Task> getTask(@PathVariable Long taskId) {
        Task task = taskService.findById(taskId);
        return ResponseEntity.ok(task);
    }

    @GetMapping("/project/{projectId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Task>> getTasksByProject(@PathVariable Long projectId) {
        List<Task> tasks = taskService.getTasksByProject(projectId);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/project/{projectId}/kanban")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<KanbanBoard> getKanbanBoard(@PathVariable Long projectId) {
        KanbanBoard board = taskService.getKanbanBoard(projectId);
        return ResponseEntity.ok(board);
    }

    @GetMapping("/my-tasks")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Task>> getMyTasks(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Task> tasks = taskService.getTasksByAssignee(user.getId());
        return ResponseEntity.ok(tasks);
    }
}

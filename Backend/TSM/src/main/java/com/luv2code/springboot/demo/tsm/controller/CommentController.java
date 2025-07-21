package com.luv2code.springboot.demo.tsm.controller;

import com.luv2code.springboot.demo.tsm.dto.request.CreateCommentRequest;
import com.luv2code.springboot.demo.tsm.entity.Comment;
import com.luv2code.springboot.demo.tsm.entity.User;
import com.luv2code.springboot.demo.tsm.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "http://localhost:4200")
public class CommentController {

    @Autowired
    private CommentService commentService;

    // Tất cả authenticated users có thể tạo comment
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<Comment> createComment(@Valid @RequestBody CreateCommentRequest request,
                                                 Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Comment comment = commentService.createComment(request, user.getId());
        return ResponseEntity.ok(comment);
    }

    // Tất cả authenticated users có thể update comment (với ownership check trong service)
    @PutMapping("/{commentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<Comment> updateComment(@PathVariable Long commentId,
                                                 @RequestBody Map<String, String> request,
                                                 Authentication authentication) {
        String newContent = request.get("content");
        User user = (User) authentication.getPrincipal();
        Comment comment = commentService.updateComment(commentId, newContent, user.getId());
        return ResponseEntity.ok(comment);
    }

    // Tất cả authenticated users có thể delete comment (với ownership check trong service)
    @DeleteMapping("/{commentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId,
                                              Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        commentService.deleteComment(commentId, user.getId());
        return ResponseEntity.noContent().build();
    }

    // Tất cả authenticated users có thể xem comments của task
    @GetMapping("/task/{taskId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<List<Comment>> getCommentsByTask(@PathVariable Long taskId) {
        List<Comment> comments = commentService.getCommentsByTask(taskId);
        return ResponseEntity.ok(comments);
    }

    // Tất cả authenticated users có thể xem comment count
    @GetMapping("/task/{taskId}/count")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<Long> getCommentCount(@PathVariable Long taskId) {
        Long count = commentService.getCommentCount(taskId);
        return ResponseEntity.ok(count);
    }
}

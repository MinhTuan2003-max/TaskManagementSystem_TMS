package com.luv2code.springboot.demo.tsm.service;

import com.luv2code.springboot.demo.tsm.dto.request.CreateCommentRequest;
import com.luv2code.springboot.demo.tsm.entity.Comment;
import com.luv2code.springboot.demo.tsm.entity.Project;
import com.luv2code.springboot.demo.tsm.entity.Task;
import com.luv2code.springboot.demo.tsm.entity.User;
import com.luv2code.springboot.demo.tsm.repository.CommentRepository;
import com.luv2code.springboot.demo.tsm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    @Lazy
    private TaskService taskService; // Lazy để tránh circular dependency

    @Autowired
    private UserService userService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProjectMemberService projectMemberService;

    public Comment createComment(CreateCommentRequest request, Long authorId) {
        Task task = taskService.findById(request.getTaskId());
        User author = userService.findById(authorId);

        // Phân quyền: Comment chỉ cho Manager/Member gán task hoặc Owner/Admin
        if (!(isTaskAssignee(authorId, task) || isOwnerOrManager(authorId, task.getProject()) || isAdmin(authorId))) {
            throw new AccessDeniedException("Không có quyền bình luận task này");
        }

        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setTask(task);
        comment.setAuthor(author);

        Comment savedComment = commentRepository.save(comment);

        notificationService.createCommentAddedNotification(savedComment, author);

        // Nếu có WebSocket, gửi realtime notification ở đây

        return savedComment;
    }

    public Comment updateComment(Long commentId, String newContent, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getAuthor().getId().equals(userId)) {
            throw new AccessDeniedException("Chỉ người tạo comment mới có thể chỉnh sửa");
        }

        comment.setContent(newContent);
        return commentRepository.save(comment);
    }

    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getAuthor().getId().equals(userId) && !isAdminOrManager(userId)) {
            throw new AccessDeniedException("Chỉ người tạo comment hoặc admin/manager mới có thể xóa");
        }

        commentRepository.delete(comment);
    }

    public Comment findById(Long commentId) {
        return commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + commentId));
    }

    public List<Comment> getCommentsByTask(Long taskId) {
        return commentRepository.findByTaskIdWithAuthor(taskId);
    }

    public Long getCommentCount(Long taskId) {
        return commentRepository.countByTaskId(taskId);
    }

    private boolean isAdminOrManager(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return false;
        return user.getRoles().stream()
                .anyMatch(role -> role.getName().equals("ROLE_ADMIN") || role.getName().equals("ROLE_MANAGER"));
    }

    private boolean isTaskAssignee(Long userId, Task task) {
        return task.getAssignee() != null && task.getAssignee().getId().equals(userId);
    }

    private boolean isOwnerOrManager(Long userId, Project project) {
        if (project.getOwner() != null && project.getOwner().getId().equals(userId)) {
            return true;
        }
        return projectMemberService.isUserProjectManager(userId, project.getId()) || isAdminOrManager(userId);
    }

    private boolean isAdmin(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return false;
        return user.getRoles().stream().anyMatch(role -> role.getName().equals("ROLE_ADMIN"));
    }

    //save comment
    public Comment saveComment(Comment comment) {
        return commentRepository.save(comment);
    }
}

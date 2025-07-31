package com.luv2code.springboot.demo.tsm.repository;

import com.luv2code.springboot.demo.tsm.entity.Task;
import com.luv2code.springboot.demo.tsm.entity.enumerator.Priority;
import com.luv2code.springboot.demo.tsm.entity.enumerator.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProjectIdOrderByCreatedAtDesc(Long projectId);

    List<Task> findByAssigneeIdAndStatusOrderByDeadlineAsc(Long assigneeId, TaskStatus status);

    List<Task> findByDeadlineBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT t FROM Task t WHERE t.project.id = :projectId AND t.status = :status ORDER BY t.createdAt DESC")
    List<Task> findByProjectIdAndStatus(@Param("projectId") Long projectId,
                                        @Param("status") TaskStatus status);

    @Query("SELECT t FROM Task t JOIN FETCH t.assignee JOIN FETCH t.creator WHERE t.project.id = :projectId")
    List<Task> findByProjectIdWithAssigneeAndCreator(@Param("projectId") Long projectId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.project.id = :projectId AND t.status = :status")
    Long countByProjectIdAndStatus(@Param("projectId") Long projectId, @Param("status") TaskStatus status);

    List<Task> findByProjectId(Long projectId);

    List<Task> findByAssigneeId(Long assigneeId);

    @Query("SELECT t FROM Task t WHERE " +
            "(:keyword IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(t.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
            "(:status IS NULL OR t.status = :status) AND " +
            "(:priority IS NULL OR t.priority = :priority) AND " +
            "(:assigneeId IS NULL OR t.assignee.id = :assigneeId) AND " +
            "(:projectId IS NULL OR t.project.id = :projectId)")

        List<Task> findTasksWithFilters(
            @Param("keyword") String keyword,
            @Param("status") TaskStatus status,
            @Param("priority") Priority priority,
            @Param("assigneeId") Long assigneeId,
            @Param("projectId") Long projectId
    );

    List<Task> findByProjectIdIn(List<Long> projectIds);
}

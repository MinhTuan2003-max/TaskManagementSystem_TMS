package com.luv2code.springboot.demo.tsm.repository;

import com.luv2code.springboot.demo.tsm.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByTaskIdOrderByCreatedAtDesc(Long taskId);

    @Query("SELECT c FROM Comment c JOIN FETCH c.author WHERE c.task.id = :taskId ORDER BY c.createdAt DESC")
    List<Comment> findByTaskIdWithAuthor(@Param("taskId") Long taskId);

    Long countByTaskId(Long taskId);

    void deleteByTaskId(Long taskId);
}

package com.luv2code.springboot.demo.tsm.repository;

import com.luv2code.springboot.demo.tsm.entity.ProjectMember;
import com.luv2code.springboot.demo.tsm.entity.enumerator.ProjectRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {

    List<ProjectMember> findByProjectIdOrderByJoinedAtDesc(Long projectId);

    List<ProjectMember> findByUserIdOrderByJoinedAtDesc(Long userId);

    Optional<ProjectMember> findByProjectIdAndUserId(Long projectId, Long userId);

    @Query("SELECT pm FROM ProjectMember pm JOIN FETCH pm.user WHERE pm.project.id = :projectId ORDER BY pm.joinedAt DESC")
    List<ProjectMember> findByProjectIdWithUser(@Param("projectId") Long projectId);

    @Query("SELECT pm FROM ProjectMember pm JOIN FETCH pm.project WHERE pm.user.id = :userId ORDER BY pm.joinedAt DESC")
    List<ProjectMember> findByUserIdWithProject(@Param("userId") Long userId);

    boolean existsByProjectIdAndUserId(Long projectId, Long userId);

    List<ProjectMember> findByProjectIdAndRole(Long projectId, ProjectRole role);

    void deleteByProjectIdAndUserId(Long projectId, Long userId);
}
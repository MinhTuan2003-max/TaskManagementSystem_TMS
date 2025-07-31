package com.luv2code.springboot.demo.tsm.repository;

import com.luv2code.springboot.demo.tsm.entity.Project;
import com.luv2code.springboot.demo.tsm.entity.ProjectMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);

    @Query("SELECT pm.user.id FROM ProjectMember pm WHERE pm.project.id = :projectId")
    List<Long> findUserIdsByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT p FROM Project p WHERE p.owner.id = :userId OR p.id IN " +
            "(SELECT pm.project.id FROM ProjectMember pm WHERE pm.user.id = :userId)")
    List<Project> findAllUserProjects(@Param("userId") Long userId);

    @Query("SELECT pm FROM ProjectMember pm JOIN FETCH pm.user WHERE pm.project.id = :projectId")
    List<ProjectMember> findByProjectIdWithUser(@Param("projectId") Long projectId);

    @Query("SELECT DISTINCT p FROM Project p JOIN p.members m WHERE m.user.id = :userId AND m.role = 'MANAGER'")
    List<Project> findProjectsManagedByUser(@Param("userId") Long userId);
}
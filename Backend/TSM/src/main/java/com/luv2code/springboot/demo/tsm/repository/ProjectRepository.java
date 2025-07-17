package com.luv2code.springboot.demo.tsm.repository;

import com.luv2code.springboot.demo.tsm.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);

    @Query("SELECT p FROM Project p JOIN p.members m WHERE m.user.id = :userId")
    List<Project> findProjectsByMemberId(@Param("userId") Long userId);

    @Query("SELECT p FROM Project p WHERE p.owner.id = :userId OR p.id IN " +
            "(SELECT pm.project.id FROM ProjectMember pm WHERE pm.user.id = :userId)")
    List<Project> findAllUserProjects(@Param("userId") Long userId);
}

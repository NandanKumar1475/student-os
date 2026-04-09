package com.studentos.server.repository;

import com.studentos.server.entity.Target;
import com.studentos.server.enums.Status;
import com.studentos.server.enums.TargetType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TargetRepository extends JpaRepository<Target, Long> {

    List<Target> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Target> findByUserIdAndStatusOrderByPriorityAsc(Long userId, Status status);

    List<Target> findByUserIdAndTypeOrderByCreatedAtDesc(Long userId, TargetType type);

    Optional<Target> findByIdAndUserId(Long id, Long userId);

    Optional<Target> findByUserIdAndIsFocusedTrue(Long userId);

    long countByUserIdAndStatus(Long userId, Status status);
}
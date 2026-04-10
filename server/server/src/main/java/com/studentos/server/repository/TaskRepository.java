// server/src/main/java/com/studentos/server/repository/TaskRepository.java

package com.studentos.server.repository;

import com.studentos.server.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByUserIdOrderByDueDateAscDueTimeAsc(Long userId);

    List<Task> findByUserIdAndDueDateOrderByDueTimeAsc(Long userId, LocalDate date);

    List<Task> findByUserIdAndCompletedOrderByDueDateAsc(Long userId, Boolean completed);

    List<Task> findByUserIdAndDueDateAfterOrderByDueDateAsc(Long userId, LocalDate date);

    List<Task> findByUserIdAndTargetId(Long userId, Long targetId);

    long countByUserIdAndDueDateAndCompleted(Long userId, LocalDate date, Boolean completed);

    long countByUserId(Long userId);
}
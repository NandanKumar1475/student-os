// server/src/main/java/com/studentos/server/repository/DailyActivityRepository.java

package com.studentos.server.repository;

import com.studentos.server.entity.DailyActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyActivityRepository extends JpaRepository<DailyActivity, Long> {

    Optional<DailyActivity> findByUserIdAndActivityDate(Long userId, LocalDate date);

    List<DailyActivity> findByUserIdAndActivityDateBetweenOrderByActivityDateAsc(
            Long userId, LocalDate start, LocalDate end);

    @Query("SELECT COUNT(d) FROM DailyActivity d WHERE d.user.id = :userId AND d.intensity > 0")
    long countActiveDays(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(d.xpEarned), 0) FROM DailyActivity d WHERE d.user.id = :userId")
    int getTotalXP(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(d.xpEarned), 0) FROM DailyActivity d WHERE d.user.id = :userId " +
            "AND d.activityDate >= :startDate")
    int getXPSince(@Param("userId") Long userId, @Param("startDate") LocalDate startDate);

    @Query("SELECT COALESCE(SUM(d.tasksCompleted), 0) FROM DailyActivity d WHERE d.user.id = :userId")
    int getTotalTasksCompleted(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(d.notesCreated), 0) FROM DailyActivity d WHERE d.user.id = :userId")
    int getTotalNotesCreated(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(d.studyMinutes), 0) FROM DailyActivity d WHERE d.user.id = :userId")
    int getTotalStudyMinutes(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(d.pomodoroSessions), 0) FROM DailyActivity d WHERE d.user.id = :userId")
    int getTotalPomodoroSessions(@Param("userId") Long userId);

    @Query("SELECT d.activityDate FROM DailyActivity d WHERE d.user.id = :userId AND d.intensity > 0 " +
            "ORDER BY d.activityDate DESC")
    List<LocalDate> getActiveDatesSorted(@Param("userId") Long userId);
}

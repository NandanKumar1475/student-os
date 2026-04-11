// server/src/main/java/com/studentos/server/repository/UserAchievementRepository.java

package com.studentos.server.repository;

import com.studentos.server.entity.UserAchievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserAchievementRepository extends JpaRepository<UserAchievement, Long> {
    List<UserAchievement> findByUserIdOrderByUnlockedAtDesc(Long userId);
    boolean existsByUserIdAndAchievementId(Long userId, Long achievementId);
    boolean existsByUserIdAndAchievementCode(Long userId, String code);
    long countByUserId(Long userId);
    List<UserAchievement> findByUserIdAndSeenFalse(Long userId);
}

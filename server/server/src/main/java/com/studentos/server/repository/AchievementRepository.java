// server/src/main/java/com/studentos/server/repository/AchievementRepository.java

package com.studentos.server.repository;

import com.studentos.server.entity.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, Long> {
    Optional<Achievement> findByCode(String code);
    List<Achievement> findAllByOrderBySortOrderAsc();
    List<Achievement> findByConditionTypeOrderByConditionValueAsc(String conditionType);
}

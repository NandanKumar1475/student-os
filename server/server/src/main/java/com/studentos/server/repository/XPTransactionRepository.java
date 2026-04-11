// server/src/main/java/com/studentos/server/repository/XPTransactionRepository.java

package com.studentos.server.repository;

import com.studentos.server.entity.XPTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface XPTransactionRepository extends JpaRepository<XPTransaction, Long> {
    List<XPTransaction> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<XPTransaction> findTop20ByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT COALESCE(SUM(x.amount), 0) FROM XPTransaction x WHERE x.user.id = :userId")
    int getTotalXP(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(x.amount), 0) FROM XPTransaction x WHERE x.user.id = :userId " +
            "AND x.createdAt >= :since")
    int getXPSince(@Param("userId") Long userId, @Param("since") LocalDateTime since);
}

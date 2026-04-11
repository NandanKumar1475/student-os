package com.studentos.server.repository;

// server/src/main/java/com/studentos/server/repository/NoteRepository.java

import com.studentos.server.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {

    List<Note> findByUserIdOrderByPinnedDescUpdatedAtDesc(Long userId);

    @Query("SELECT n FROM Note n WHERE n.user.id = :userId AND " +
            "(LOWER(n.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(n.content) LIKE LOWER(CONCAT('%', :query, '%'))) " +
            "ORDER BY n.pinned DESC, n.updatedAt DESC")
    List<Note> searchNotes(@Param("userId") Long userId, @Param("query") String query);

    @Query("SELECT n FROM Note n JOIN n.tags t WHERE n.user.id = :userId AND t = :tag " +
            "ORDER BY n.pinned DESC, n.updatedAt DESC")
    List<Note> findByUserIdAndTag(@Param("userId") Long userId, @Param("tag") String tag);

    @Query("SELECT DISTINCT t FROM Note n JOIN n.tags t WHERE n.user.id = :userId ORDER BY t")
    List<String> findAllTagsByUserId(@Param("userId") Long userId);

    long countByUserId(Long userId);
}
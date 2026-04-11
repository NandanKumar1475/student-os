// server/src/main/java/com/studentos/server/entity/UserAchievement.java

package com.studentos.server.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_achievements", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "achievement_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAchievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "achievement_id", nullable = false)
    private Achievement achievement;

    private LocalDateTime unlockedAt;

    @Builder.Default
    private Boolean seen = false; // for "new badge!" notification

    @PrePersist
    protected void onCreate() {
        unlockedAt = LocalDateTime.now();
    }
}

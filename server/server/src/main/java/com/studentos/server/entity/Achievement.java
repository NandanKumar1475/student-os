// server/src/main/java/com/studentos/server/entity/Achievement.java

package com.studentos.server.entity;

import com.studentos.server.enums.AchievementCategory;
import com.studentos.server.enums.AchievementRarity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "achievements")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Achievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;  // e.g. "STREAK_7", "TASK_MASTER_100"

    @Column(nullable = false)
    private String title;

    private String description;

    private String icon;  // emoji or icon name

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AchievementCategory category;  // STREAK, TASK, NOTE, XP, SPECIAL

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private AchievementRarity rarity = AchievementRarity.COMMON;

    @Column(nullable = false)
    @Builder.Default
    private Integer xpReward = 0;

    // ── Unlock condition ──
    @Column(nullable = false)
    private String conditionType;  // "streak_days", "tasks_completed", "total_xp", "notes_created", "pomodoro_sessions", "study_hours"

    @Column(nullable = false)
    private Integer conditionValue;  // threshold to unlock

    @Builder.Default
    private Integer sortOrder = 0;
}

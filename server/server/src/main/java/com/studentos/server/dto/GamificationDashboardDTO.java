// server/src/main/java/com/studentos/server/dto/GamificationDashboardDTO.java

package com.studentos.server.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GamificationDashboardDTO {
    private StreakDTO streak;
    private XPSummaryDTO xp;
    private List<AchievementDTO> achievements;
    private List<AchievementDTO> newAchievements; // unseen unlocked ones
    private List<DailyActivityDTO> heatmap;        // last 365 days
    private StatsDTO stats;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StatsDTO {
        private Integer totalActiveDays;
        private Integer totalTasksCompleted;
        private Integer totalNotesCreated;
        private Integer totalStudyHours;
        private Integer totalPomodoroSessions;
        private Integer achievementsUnlocked;
        private Integer achievementsTotal;
    }
}

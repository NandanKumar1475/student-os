// server/src/main/java/com/studentos/server/dto/StreakDTO.java

package com.studentos.server.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StreakDTO {
    private Integer currentStreak;
    private Integer longestStreak;
    private Integer streakFreezes;    // remaining freezes
    private Boolean todayActive;
    private Boolean streakAtRisk;     // will break tomorrow if no activity
    private String streakStatus;      // "on_fire", "at_risk", "frozen", "broken"
}

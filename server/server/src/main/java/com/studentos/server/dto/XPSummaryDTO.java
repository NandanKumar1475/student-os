// server/src/main/java/com/studentos/server/dto/XPSummaryDTO.java

package com.studentos.server.dto;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class XPSummaryDTO {
    private Integer totalXP;
    private Integer level;
    private Integer currentLevelXP;    // XP within current level
    private Integer nextLevelXP;       // XP needed for next level
    private Double levelProgress;      // 0.0 to 1.0
    private String rank;               // "Beginner", "Scholar", "Master", etc.
    private Integer xpToday;
    private Integer xpThisWeek;
    private Integer xpThisMonth;
    private List<XPTransactionDTO> recentTransactions;
}

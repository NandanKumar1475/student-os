// server/src/main/java/com/studentos/server/dto/AchievementDTO.java

package com.studentos.server.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AchievementDTO {
    private Long id;
    private String code;
    private String title;
    private String description;
    private String icon;
    private String category;
    private String rarity;
    private Integer xpReward;
    private Boolean unlocked;
    private LocalDateTime unlockedAt;
    private Double progress;         // 0.0 to 1.0
    private Integer currentValue;
    private Integer targetValue;
}

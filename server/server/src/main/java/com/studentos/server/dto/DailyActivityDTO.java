// server/src/main/java/com/studentos/server/dto/DailyActivityDTO.java

package com.studentos.server.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyActivityDTO {
    private LocalDate date;
    private Integer tasksCompleted;
    private Integer notesCreated;
    private Integer studyMinutes;
    private Integer pomodoroSessions;
    private Integer xpEarned;
    private Integer intensity;  // 0-4
}

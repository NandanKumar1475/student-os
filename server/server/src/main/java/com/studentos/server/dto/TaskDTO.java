// server/src/main/java/com/studentos/server/dto/TaskDTO.java

package com.studentos.server.dto;

import com.studentos.server.enums.Priority;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskDTO {
    private Long id;
    private Long targetId;
    private String targetTitle;
    private String title;
    private String description;
    private Priority priority;
    private LocalDate dueDate;
    private LocalTime dueTime;
    private Boolean completed;
}
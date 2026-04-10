// server/src/main/java/com/studentos/server/dto/TaskRequestDTO.java

package com.studentos.server.dto;

import com.studentos.server.enums.Priority;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskRequestDTO {
    private Long targetId;
    private String title;
    private String description;
    private Priority priority;
    private LocalDate dueDate;
    private LocalTime dueTime;
}
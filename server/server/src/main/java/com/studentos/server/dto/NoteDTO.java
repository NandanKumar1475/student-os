package com.studentos.server.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoteDTO {
    private Long id;
    private String title;
    private String content;
    private String preview;
    private List<String> tags;
    private Boolean pinned;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

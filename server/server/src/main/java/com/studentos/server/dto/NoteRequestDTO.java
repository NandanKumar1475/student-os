// server/src/main/java/com/studentos/server/dto/NoteRequestDTO.java

package com.studentos.server.dto;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NoteRequestDTO {
    private String title;
    private String content;
    private List<String> tags;
}
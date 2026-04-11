// server/src/main/java/com/studentos/server/dto/XPTransactionDTO.java

package com.studentos.server.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class XPTransactionDTO {
    private Integer amount;
    private String source;
    private String description;
    private LocalDateTime createdAt;
}

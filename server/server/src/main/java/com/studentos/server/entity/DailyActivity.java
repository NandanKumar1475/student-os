// server/src/main/java/com/studentos/server/entity/DailyActivity.java

package com.studentos.server.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "daily_activities", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "activity_date"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "activity_date", nullable = false)
    private LocalDate activityDate;

    // ── Activity metrics ──
    @Builder.Default
    private Integer tasksCompleted = 0;

    @Builder.Default
    private Integer notesCreated = 0;

    @Builder.Default
    private Integer studyMinutes = 0;

    @Builder.Default
    private Integer pomodoroSessions = 0;

    @Builder.Default
    private Integer xpEarned = 0;

    // ── Intensity level (0-4 like GitHub) ──
    @Builder.Default
    private Integer intensity = 0;

    @Builder.Default
    private Boolean streakCounted = false;

    private LocalDateTime firstActivityAt;
    private LocalDateTime lastActivityAt;

    @PrePersist
    protected void onCreate() {
        if (firstActivityAt == null) firstActivityAt = LocalDateTime.now();
        lastActivityAt = LocalDateTime.now();
        calculateIntensity();
    }

    @PreUpdate
    protected void onUpdate() {
        lastActivityAt = LocalDateTime.now();
        calculateIntensity();
    }

    public void calculateIntensity() {
        int score = tasksCompleted * 10 + notesCreated * 5 + studyMinutes + pomodoroSessions * 15;
        if (score >= 120) intensity = 4;
        else if (score >= 80) intensity = 3;
        else if (score >= 40) intensity = 2;
        else if (score > 0) intensity = 1;
        else intensity = 0;
    }

    public void addTaskCompleted(int xp) {
        this.tasksCompleted++;
        this.xpEarned += xp;
    }

    public void addNoteCreated(int xp) {
        this.notesCreated++;
        this.xpEarned += xp;
    }

    public void addStudyMinutes(int minutes, int xp) {
        this.studyMinutes += minutes;
        this.xpEarned += xp;
    }

    public void addPomodoroSession(int xp) {
        this.pomodoroSessions++;
        this.xpEarned += xp;
    }
}

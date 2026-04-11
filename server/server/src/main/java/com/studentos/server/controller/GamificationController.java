package com.studentos.server.controller;

import com.studentos.server.dto.AchievementDTO;
import com.studentos.server.dto.DailyActivityDTO;
import com.studentos.server.dto.GamificationDashboardDTO;
import com.studentos.server.dto.StreakDTO;
import com.studentos.server.dto.XPSummaryDTO;
import com.studentos.server.dto.request.StudySessionRequest;
import com.studentos.server.security.UserPrincipal;
import com.studentos.server.service.GamificationService;
import com.studentos.server.service.StreakService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/gamification")
@RequiredArgsConstructor
public class GamificationController {

    private final GamificationService gamificationService;
    private final StreakService streakService;

    @GetMapping("/dashboard")
    public ResponseEntity<GamificationDashboardDTO> getDashboard(
            @AuthenticationPrincipal UserPrincipal user) {

        return ResponseEntity.ok(gamificationService.getDashboard(user.getId()));
    }

    @GetMapping("/streak")
    public ResponseEntity<StreakDTO> getStreak(
            @AuthenticationPrincipal UserPrincipal user) {

        return ResponseEntity.ok(streakService.getStreak(user.getId()));
    }

    @GetMapping("/xp")
    public ResponseEntity<XPSummaryDTO> getXP(
            @AuthenticationPrincipal UserPrincipal user) {

        return ResponseEntity.ok(gamificationService.getXPSummary(user.getId()));
    }

    @GetMapping("/achievements")
    public ResponseEntity<List<AchievementDTO>> getAchievements(
            @AuthenticationPrincipal UserPrincipal user) {

        return ResponseEntity.ok(gamificationService.getAllAchievementsWithProgress(user.getId()));
    }

    @GetMapping("/achievements/new")
    public ResponseEntity<List<AchievementDTO>> getNewAchievements(
            @AuthenticationPrincipal UserPrincipal user) {

        return ResponseEntity.ok(gamificationService.getNewAchievements(user.getId()));
    }

    @PostMapping("/achievements/seen")
    public ResponseEntity<Void> markAchievementsSeen(
            @AuthenticationPrincipal UserPrincipal user) {

        gamificationService.markAchievementsSeen(user.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/heatmap")
    public ResponseEntity<List<DailyActivityDTO>> getHeatmap(
            @AuthenticationPrincipal UserPrincipal user) {

        return ResponseEntity.ok(gamificationService.getHeatmap(user.getId()));
    }

    @PostMapping("/record/login")
    public ResponseEntity<List<AchievementDTO>> recordLogin(
            @AuthenticationPrincipal UserPrincipal user) {

        return ResponseEntity.ok(gamificationService.recordDailyLogin(user.getId()));
    }

    @PostMapping("/record/task")
    public ResponseEntity<List<AchievementDTO>> recordTask(
            @AuthenticationPrincipal UserPrincipal user) {

        return ResponseEntity.ok(gamificationService.recordTaskComplete(user.getId()));
    }

    @PostMapping("/record/note")
    public ResponseEntity<List<AchievementDTO>> recordNote(
            @AuthenticationPrincipal UserPrincipal user) {

        return ResponseEntity.ok(gamificationService.recordNoteCreated(user.getId()));
    }

    @PostMapping("/record/study")
    public ResponseEntity<List<AchievementDTO>> recordStudy(
            @AuthenticationPrincipal UserPrincipal user,
            @Valid @RequestBody StudySessionRequest request) {

        return ResponseEntity.ok(gamificationService.recordStudySession(user.getId(), request.getMinutes()));
    }

    @PostMapping("/record/pomodoro")
    public ResponseEntity<List<AchievementDTO>> recordPomodoro(
            @AuthenticationPrincipal UserPrincipal user) {

        return ResponseEntity.ok(gamificationService.recordPomodoro(user.getId()));
    }
}

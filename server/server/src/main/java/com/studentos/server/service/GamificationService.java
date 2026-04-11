// server/src/main/java/com/studentos/server/service/GamificationService.java

package com.studentos.server.service;

import com.studentos.server.dto.*;
import com.studentos.server.entity.*;
import com.studentos.server.enums.XPSource;
import com.studentos.server.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GamificationService {

    private final DailyActivityRepository dailyActivityRepo;
    private final AchievementRepository achievementRepo;
    private final UserAchievementRepository userAchievementRepo;
    private final XPTransactionRepository xpTransactionRepo;
    private final UserRepository userRepo;
    private final StreakService streakService;

    // ── XP Level Thresholds ──
    private static final int[] LEVEL_THRESHOLDS = {
            0, 100, 250, 500, 850, 1300, 1900, 2600, 3500, 4600,      // 1-10
            5900, 7400, 9200, 11300, 13700, 16500, 19700, 23400, 27600, 32400,  // 11-20
            37800, 43900, 50700, 58300, 66700, 76000, 86200, 97400, 109700, 123200, // 21-30
            138000, 154200, 172000, 191500, 213000, 236500, 262200, 290300, 321000, 354500, // 31-40
            391000, 430800, 474200, 521500, 573000, 629000, 690000, 756500, 829000, 908000   // 41-50
    };

    private static final String[] RANKS = {
            "Newbie", "Beginner", "Apprentice", "Student", "Scholar",
            "Researcher", "Expert", "Master", "Grandmaster", "Legend",
            "Mythic", "Immortal", "Transcendent"
    };

    // ══════════════════════════════════
    // ── CORE: Record Activity + Award XP ──
    // ══════════════════════════════════

    @Transactional
    public List<AchievementDTO> recordTaskComplete(Long userId) {
        DailyActivity activity = getOrCreateToday(userId);
        activity.addTaskCompleted(15);
        dailyActivityRepo.save(activity);
        addXP(userId, 15, XPSource.TASK_COMPLETE, "Completed a task");
        return checkAchievements(userId);
    }

    @Transactional
    public List<AchievementDTO> recordNoteCreated(Long userId) {
        DailyActivity activity = getOrCreateToday(userId);
        activity.addNoteCreated(10);
        dailyActivityRepo.save(activity);
        addXP(userId, 10, XPSource.NOTE_CREATE, "Created a note");
        return checkAchievements(userId);
    }

    @Transactional
    public List<AchievementDTO> recordStudySession(Long userId, int minutes) {
        DailyActivity activity = getOrCreateToday(userId);
        int xp = Math.min(minutes * 2, 100); // cap at 100 XP per session
        activity.addStudyMinutes(minutes, xp);
        dailyActivityRepo.save(activity);
        addXP(userId, xp, XPSource.STUDY_SESSION, minutes + " min study session");
        return checkAchievements(userId);
    }

    @Transactional
    public List<AchievementDTO> recordPomodoro(Long userId) {
        DailyActivity activity = getOrCreateToday(userId);
        activity.addPomodoroSession(20);
        dailyActivityRepo.save(activity);
        addXP(userId, 20, XPSource.POMODORO, "Pomodoro session complete");
        return checkAchievements(userId);
    }

    @Transactional
    public List<AchievementDTO> recordDailyLogin(Long userId) {
        DailyActivity activity = getOrCreateToday(userId);
        if (!activity.getStreakCounted()) {
            activity.setStreakCounted(true);
            dailyActivityRepo.save(activity);

            // Streak bonus XP
            StreakDTO streak = streakService.getStreak(userId);
            int streakBonus = Math.min(streak.getCurrentStreak() * 5, 50);
            if (streakBonus > 0) {
                addXP(userId, streakBonus, XPSource.STREAK_BONUS,
                        streak.getCurrentStreak() + " day streak bonus");
            }
            addXP(userId, 5, XPSource.DAILY_LOGIN, "Daily login");
        }
        return checkAchievements(userId);
    }

    // ══════════════════════════════════
    // ── GET DASHBOARD DATA ──
    // ══════════════════════════════════

    public GamificationDashboardDTO getDashboard(Long userId) {
        StreakDTO streak = streakService.getStreak(userId);
        XPSummaryDTO xp = getXPSummary(userId);
        List<AchievementDTO> achievements = getAllAchievementsWithProgress(userId);
        List<AchievementDTO> newAchievements = getNewAchievements(userId);
        List<DailyActivityDTO> heatmap = getHeatmap(userId);
        GamificationDashboardDTO.StatsDTO stats = getStats(userId);

        return GamificationDashboardDTO.builder()
                .streak(streak)
                .xp(xp)
                .achievements(achievements)
                .newAchievements(newAchievements)
                .heatmap(heatmap)
                .stats(stats)
                .build();
    }

    // ══════════════════════════════════
    // ── XP & LEVEL SYSTEM ──
    // ══════════════════════════════════

    public XPSummaryDTO getXPSummary(Long userId) {
        int totalXP = xpTransactionRepo.getTotalXP(userId);
        int level = calculateLevel(totalXP);
        int currentLevelStart = level > 0 && level <= LEVEL_THRESHOLDS.length ? LEVEL_THRESHOLDS[level - 1] : 0;
        int nextLevelXP = level < LEVEL_THRESHOLDS.length ? LEVEL_THRESHOLDS[level] : LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + 50000;
        int currentLevelXP = totalXP - currentLevelStart;
        int levelRange = nextLevelXP - currentLevelStart;
        double progress = levelRange > 0 ? (double) currentLevelXP / levelRange : 0;

        LocalDateTime weekStart = LocalDate.now().minusDays(6).atStartOfDay();
        LocalDateTime monthStart = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();

        List<XPTransactionDTO> recent = xpTransactionRepo.findTop20ByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(t -> XPTransactionDTO.builder()
                        .amount(t.getAmount())
                        .source(t.getSource().name())
                        .description(t.getDescription())
                        .createdAt(t.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return XPSummaryDTO.builder()
                .totalXP(totalXP)
                .level(level)
                .currentLevelXP(currentLevelXP)
                .nextLevelXP(levelRange)
                .levelProgress(progress)
                .rank(getRank(level))
                .xpToday(xpTransactionRepo.getXPSince(userId, todayStart))
                .xpThisWeek(xpTransactionRepo.getXPSince(userId, weekStart))
                .xpThisMonth(xpTransactionRepo.getXPSince(userId, monthStart))
                .recentTransactions(recent)
                .build();
    }

    private int calculateLevel(int xp) {
        for (int i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
            if (xp >= LEVEL_THRESHOLDS[i]) return i + 1;
        }
        return 1;
    }

    private String getRank(int level) {
        int idx = Math.min((level - 1) / 4, RANKS.length - 1);
        return RANKS[Math.max(0, idx)];
    }

    // ══════════════════════════════════
    // ── ACHIEVEMENT SYSTEM ──
    // ══════════════════════════════════

    public List<AchievementDTO> getAllAchievementsWithProgress(Long userId) {
        List<Achievement> all = achievementRepo.findAllByOrderBySortOrderAsc();
        int totalXP = xpTransactionRepo.getTotalXP(userId);
        StreakDTO streak = streakService.getStreak(userId);
        int totalTasks = dailyActivityRepo.getTotalTasksCompleted(userId);
        int totalNotes = dailyActivityRepo.getTotalNotesCreated(userId);
        int totalStudyMins = dailyActivityRepo.getTotalStudyMinutes(userId);
        int totalPomodoro = dailyActivityRepo.getTotalPomodoroSessions(userId);

        return all.stream().map(a -> {
            boolean unlocked = userAchievementRepo.existsByUserIdAndAchievementId(userId, a.getId());
            int currentVal = getCurrentValueForCondition(a.getConditionType(),
                    streak.getCurrentStreak(), streak.getLongestStreak(),
                    totalTasks, totalNotes, totalStudyMins, totalPomodoro, totalXP);
            double progress = Math.min(1.0, (double) currentVal / a.getConditionValue());

            return AchievementDTO.builder()
                    .id(a.getId())
                    .code(a.getCode())
                    .title(a.getTitle())
                    .description(a.getDescription())
                    .icon(a.getIcon())
                    .category(a.getCategory().name())
                    .rarity(a.getRarity().name())
                    .xpReward(a.getXpReward())
                    .unlocked(unlocked)
                    .unlockedAt(null)
                    .progress(progress)
                    .currentValue(currentVal)
                    .targetValue(a.getConditionValue())
                    .build();
        }).collect(Collectors.toList());
    }

    @Transactional
    public List<AchievementDTO> checkAchievements(Long userId) {
        List<Achievement> all = achievementRepo.findAllByOrderBySortOrderAsc();
        int totalXP = xpTransactionRepo.getTotalXP(userId);
        StreakDTO streak = streakService.getStreak(userId);
        int totalTasks = dailyActivityRepo.getTotalTasksCompleted(userId);
        int totalNotes = dailyActivityRepo.getTotalNotesCreated(userId);
        int totalStudyMins = dailyActivityRepo.getTotalStudyMinutes(userId);
        int totalPomodoro = dailyActivityRepo.getTotalPomodoroSessions(userId);
        User user = userRepo.findById(userId).orElseThrow();

        List<AchievementDTO> newlyUnlocked = new ArrayList<>();

        for (Achievement a : all) {
            if (userAchievementRepo.existsByUserIdAndAchievementId(userId, a.getId())) continue;

            int currentVal = getCurrentValueForCondition(a.getConditionType(),
                    streak.getCurrentStreak(), streak.getLongestStreak(),
                    totalTasks, totalNotes, totalStudyMins, totalPomodoro, totalXP);

            if (currentVal >= a.getConditionValue()) {
                // Unlock!
                UserAchievement ua = UserAchievement.builder()
                        .user(user)
                        .achievement(a)
                        .seen(false)
                        .build();
                userAchievementRepo.save(ua);

                // Award XP
                if (a.getXpReward() > 0) {
                    addXP(userId, a.getXpReward(), XPSource.ACHIEVEMENT, "Achievement: " + a.getTitle());
                }

                newlyUnlocked.add(AchievementDTO.builder()
                        .id(a.getId())
                        .code(a.getCode())
                        .title(a.getTitle())
                        .description(a.getDescription())
                        .icon(a.getIcon())
                        .category(a.getCategory().name())
                        .rarity(a.getRarity().name())
                        .xpReward(a.getXpReward())
                        .unlocked(true)
                        .progress(1.0)
                        .currentValue(a.getConditionValue())
                        .targetValue(a.getConditionValue())
                        .build());
            }
        }
        return newlyUnlocked;
    }

    public List<AchievementDTO> getNewAchievements(Long userId) {
        return userAchievementRepo.findByUserIdAndSeenFalse(userId).stream()
                .map(ua -> AchievementDTO.builder()
                        .id(ua.getAchievement().getId())
                        .code(ua.getAchievement().getCode())
                        .title(ua.getAchievement().getTitle())
                        .description(ua.getAchievement().getDescription())
                        .icon(ua.getAchievement().getIcon())
                        .rarity(ua.getAchievement().getRarity().name())
                        .xpReward(ua.getAchievement().getXpReward())
                        .unlocked(true)
                        .unlockedAt(ua.getUnlockedAt())
                        .progress(1.0)
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void markAchievementsSeen(Long userId) {
        List<UserAchievement> unseen = userAchievementRepo.findByUserIdAndSeenFalse(userId);
        unseen.forEach(ua -> ua.setSeen(true));
        userAchievementRepo.saveAll(unseen);
    }

    // ══════════════════════════════════
    // ── HEATMAP DATA ──
    // ══════════════════════════════════

    public List<DailyActivityDTO> getHeatmap(Long userId) {
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(364);
        List<DailyActivity> activities = dailyActivityRepo
                .findByUserIdAndActivityDateBetweenOrderByActivityDateAsc(userId, start, end);

        return activities.stream().map(a -> DailyActivityDTO.builder()
                .date(a.getActivityDate())
                .tasksCompleted(a.getTasksCompleted())
                .notesCreated(a.getNotesCreated())
                .studyMinutes(a.getStudyMinutes())
                .pomodoroSessions(a.getPomodoroSessions())
                .xpEarned(a.getXpEarned())
                .intensity(a.getIntensity())
                .build()
        ).collect(Collectors.toList());
    }

    // ══════════════════════════════════
    // ── STATS ──
    // ══════════════════════════════════

    private GamificationDashboardDTO.StatsDTO getStats(Long userId) {
        return GamificationDashboardDTO.StatsDTO.builder()
                .totalActiveDays((int) dailyActivityRepo.countActiveDays(userId))
                .totalTasksCompleted(dailyActivityRepo.getTotalTasksCompleted(userId))
                .totalNotesCreated(dailyActivityRepo.getTotalNotesCreated(userId))
                .totalStudyHours(dailyActivityRepo.getTotalStudyMinutes(userId) / 60)
                .totalPomodoroSessions(dailyActivityRepo.getTotalPomodoroSessions(userId))
                .achievementsUnlocked((int) userAchievementRepo.countByUserId(userId))
                .achievementsTotal((int) achievementRepo.count())
                .build();
    }

    // ══════════════════════════════════
    // ── HELPERS ──
    // ══════════════════════════════════

    private DailyActivity getOrCreateToday(Long userId) {
        LocalDate today = LocalDate.now();
        return dailyActivityRepo.findByUserIdAndActivityDate(userId, today)
                .orElseGet(() -> {
                    User user = userRepo.findById(userId).orElseThrow();
                    return dailyActivityRepo.save(DailyActivity.builder()
                            .user(user)
                            .activityDate(today)
                            .build());
                });
    }

    private void addXP(Long userId, int amount, XPSource source, String description) {
        User user = userRepo.findById(userId).orElseThrow();
        xpTransactionRepo.save(XPTransaction.builder()
                .user(user)
                .amount(amount)
                .source(source)
                .description(description)
                .build());
    }

    private int getCurrentValueForCondition(String type, int currentStreak, int longestStreak,
                                             int tasks, int notes, int studyMins, int pomodoro, int xp) {
        return switch (type) {
            case "streak_days" -> currentStreak;
            case "longest_streak" -> longestStreak;
            case "tasks_completed" -> tasks;
            case "notes_created" -> notes;
            case "study_hours" -> studyMins / 60;
            case "pomodoro_sessions" -> pomodoro;
            case "total_xp" -> xp;
            default -> 0;
        };
    }
}

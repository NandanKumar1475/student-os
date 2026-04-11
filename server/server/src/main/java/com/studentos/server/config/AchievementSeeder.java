// server/src/main/java/com/studentos/server/config/AchievementSeeder.java

package com.studentos.server.config;

import com.studentos.server.entity.Achievement;
import com.studentos.server.enums.AchievementCategory;
import com.studentos.server.enums.AchievementRarity;
import com.studentos.server.repository.AchievementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class AchievementSeeder implements CommandLineRunner {

    private final AchievementRepository repo;

    @Override
    public void run(String... args) {
        if (repo.count() > 0) return; // already seeded

        List<Achievement> achievements = List.of(
            // ── STREAK ACHIEVEMENTS ──
            Achievement.builder().code("STREAK_3").title("Getting Started").description("Maintain a 3-day streak")
                .icon("🔥").category(AchievementCategory.STREAK).rarity(AchievementRarity.COMMON)
                .xpReward(50).conditionType("streak_days").conditionValue(3).sortOrder(1).build(),

            Achievement.builder().code("STREAK_7").title("Week Warrior").description("Maintain a 7-day streak")
                .icon("⚡").category(AchievementCategory.STREAK).rarity(AchievementRarity.COMMON)
                .xpReward(100).conditionType("streak_days").conditionValue(7).sortOrder(2).build(),

            Achievement.builder().code("STREAK_14").title("Unstoppable").description("Maintain a 14-day streak")
                .icon("💪").category(AchievementCategory.STREAK).rarity(AchievementRarity.UNCOMMON)
                .xpReward(200).conditionType("streak_days").conditionValue(14).sortOrder(3).build(),

            Achievement.builder().code("STREAK_30").title("Iron Will").description("Maintain a 30-day streak")
                .icon("🛡️").category(AchievementCategory.STREAK).rarity(AchievementRarity.RARE)
                .xpReward(500).conditionType("streak_days").conditionValue(30).sortOrder(4).build(),

            Achievement.builder().code("STREAK_60").title("Diamond Hands").description("Maintain a 60-day streak")
                .icon("💎").category(AchievementCategory.STREAK).rarity(AchievementRarity.EPIC)
                .xpReward(1000).conditionType("streak_days").conditionValue(60).sortOrder(5).build(),

            Achievement.builder().code("STREAK_100").title("Century Legend").description("Maintain a 100-day streak")
                .icon("👑").category(AchievementCategory.STREAK).rarity(AchievementRarity.LEGENDARY)
                .xpReward(2500).conditionType("streak_days").conditionValue(100).sortOrder(6).build(),

            Achievement.builder().code("STREAK_365").title("Year of Fire").description("365-day streak — you're a god")
                .icon("🌟").category(AchievementCategory.STREAK).rarity(AchievementRarity.LEGENDARY)
                .xpReward(10000).conditionType("streak_days").conditionValue(365).sortOrder(7).build(),

            // ── TASK ACHIEVEMENTS ──
            Achievement.builder().code("TASK_1").title("First Step").description("Complete your first task")
                .icon("✅").category(AchievementCategory.TASK).rarity(AchievementRarity.COMMON)
                .xpReward(25).conditionType("tasks_completed").conditionValue(1).sortOrder(10).build(),

            Achievement.builder().code("TASK_10").title("Task Crusher").description("Complete 10 tasks")
                .icon("📋").category(AchievementCategory.TASK).rarity(AchievementRarity.COMMON)
                .xpReward(75).conditionType("tasks_completed").conditionValue(10).sortOrder(11).build(),

            Achievement.builder().code("TASK_50").title("Productivity Machine").description("Complete 50 tasks")
                .icon("⚙️").category(AchievementCategory.TASK).rarity(AchievementRarity.UNCOMMON)
                .xpReward(200).conditionType("tasks_completed").conditionValue(50).sortOrder(12).build(),

            Achievement.builder().code("TASK_100").title("Task Master").description("Complete 100 tasks")
                .icon("🏆").category(AchievementCategory.TASK).rarity(AchievementRarity.RARE)
                .xpReward(500).conditionType("tasks_completed").conditionValue(100).sortOrder(13).build(),

            Achievement.builder().code("TASK_500").title("Relentless").description("Complete 500 tasks")
                .icon("🔱").category(AchievementCategory.TASK).rarity(AchievementRarity.EPIC)
                .xpReward(1500).conditionType("tasks_completed").conditionValue(500).sortOrder(14).build(),

            Achievement.builder().code("TASK_1000").title("The Finisher").description("Complete 1000 tasks")
                .icon("💀").category(AchievementCategory.TASK).rarity(AchievementRarity.LEGENDARY)
                .xpReward(5000).conditionType("tasks_completed").conditionValue(1000).sortOrder(15).build(),

            // ── NOTE ACHIEVEMENTS ──
            Achievement.builder().code("NOTE_1").title("Note Taker").description("Create your first note")
                .icon("📝").category(AchievementCategory.NOTE).rarity(AchievementRarity.COMMON)
                .xpReward(25).conditionType("notes_created").conditionValue(1).sortOrder(20).build(),

            Achievement.builder().code("NOTE_25").title("Knowledge Builder").description("Create 25 notes")
                .icon("📚").category(AchievementCategory.NOTE).rarity(AchievementRarity.UNCOMMON)
                .xpReward(150).conditionType("notes_created").conditionValue(25).sortOrder(21).build(),

            Achievement.builder().code("NOTE_100").title("Encyclopedia").description("Create 100 notes")
                .icon("🧠").category(AchievementCategory.NOTE).rarity(AchievementRarity.RARE)
                .xpReward(500).conditionType("notes_created").conditionValue(100).sortOrder(22).build(),

            Achievement.builder().code("NOTE_500").title("The Archivist").description("Create 500 notes")
                .icon("🏛️").category(AchievementCategory.NOTE).rarity(AchievementRarity.LEGENDARY)
                .xpReward(3000).conditionType("notes_created").conditionValue(500).sortOrder(23).build(),

            // ── STUDY ACHIEVEMENTS ──
            Achievement.builder().code("STUDY_10").title("Dedicated Learner").description("Study for 10 hours")
                .icon("📖").category(AchievementCategory.STUDY).rarity(AchievementRarity.COMMON)
                .xpReward(100).conditionType("study_hours").conditionValue(10).sortOrder(30).build(),

            Achievement.builder().code("STUDY_50").title("Bookworm").description("Study for 50 hours")
                .icon("🐛").category(AchievementCategory.STUDY).rarity(AchievementRarity.UNCOMMON)
                .xpReward(300).conditionType("study_hours").conditionValue(50).sortOrder(31).build(),

            Achievement.builder().code("STUDY_100").title("Scholar").description("Study for 100 hours")
                .icon("🎓").category(AchievementCategory.STUDY).rarity(AchievementRarity.RARE)
                .xpReward(750).conditionType("study_hours").conditionValue(100).sortOrder(32).build(),

            Achievement.builder().code("STUDY_500").title("10,000 Hours").description("Study for 500 hours")
                .icon("🧙").category(AchievementCategory.STUDY).rarity(AchievementRarity.LEGENDARY)
                .xpReward(5000).conditionType("study_hours").conditionValue(500).sortOrder(33).build(),

            // ── POMODORO ACHIEVEMENTS ──
            Achievement.builder().code("POMO_10").title("Focus Starter").description("Complete 10 Pomodoro sessions")
                .icon("🍅").category(AchievementCategory.POMODORO).rarity(AchievementRarity.COMMON)
                .xpReward(75).conditionType("pomodoro_sessions").conditionValue(10).sortOrder(40).build(),

            Achievement.builder().code("POMO_50").title("Deep Focus").description("Complete 50 Pomodoro sessions")
                .icon("🎯").category(AchievementCategory.POMODORO).rarity(AchievementRarity.UNCOMMON)
                .xpReward(250).conditionType("pomodoro_sessions").conditionValue(50).sortOrder(41).build(),

            Achievement.builder().code("POMO_200").title("Zen Master").description("Complete 200 Pomodoro sessions")
                .icon("🧘").category(AchievementCategory.POMODORO).rarity(AchievementRarity.RARE)
                .xpReward(750).conditionType("pomodoro_sessions").conditionValue(200).sortOrder(42).build(),

            Achievement.builder().code("POMO_500").title("Time Lord").description("Complete 500 Pomodoro sessions")
                .icon("⏳").category(AchievementCategory.POMODORO).rarity(AchievementRarity.LEGENDARY)
                .xpReward(3000).conditionType("pomodoro_sessions").conditionValue(500).sortOrder(43).build(),

            // ── XP ACHIEVEMENTS ──
            Achievement.builder().code("XP_1000").title("Rising Star").description("Earn 1,000 XP")
                .icon("⭐").category(AchievementCategory.XP).rarity(AchievementRarity.COMMON)
                .xpReward(50).conditionType("total_xp").conditionValue(1000).sortOrder(50).build(),

            Achievement.builder().code("XP_5000").title("Powerhouse").description("Earn 5,000 XP")
                .icon("💥").category(AchievementCategory.XP).rarity(AchievementRarity.UNCOMMON)
                .xpReward(150).conditionType("total_xp").conditionValue(5000).sortOrder(51).build(),

            Achievement.builder().code("XP_25000").title("XP Overlord").description("Earn 25,000 XP")
                .icon("🌋").category(AchievementCategory.XP).rarity(AchievementRarity.RARE)
                .xpReward(500).conditionType("total_xp").conditionValue(25000).sortOrder(52).build(),

            Achievement.builder().code("XP_100000").title("Transcendent").description("Earn 100,000 XP")
                .icon("🌌").category(AchievementCategory.XP).rarity(AchievementRarity.LEGENDARY)
                .xpReward(2000).conditionType("total_xp").conditionValue(100000).sortOrder(53).build()
        );

        repo.saveAll(achievements);
        log.info("✅ Seeded {} achievements", achievements.size());
    }
}

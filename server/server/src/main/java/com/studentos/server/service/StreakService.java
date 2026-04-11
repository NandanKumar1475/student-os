// server/src/main/java/com/studentos/server/service/StreakService.java

package com.studentos.server.service;

import com.studentos.server.dto.StreakDTO;
import com.studentos.server.repository.DailyActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StreakService {

    private final DailyActivityRepository dailyActivityRepository;

    public StreakDTO getStreak(Long userId) {
        List<LocalDate> activeDates = dailyActivityRepository.getActiveDatesSorted(userId);
        LocalDate today = LocalDate.now();

        if (activeDates.isEmpty()) {
            return StreakDTO.builder()
                    .currentStreak(0)
                    .longestStreak(0)
                    .streakFreezes(2)
                    .todayActive(false)
                    .streakAtRisk(false)
                    .streakStatus("broken")
                    .build();
        }

        boolean todayActive = activeDates.contains(today);
        boolean yesterdayActive = activeDates.contains(today.minusDays(1));

        // Calculate current streak
        int currentStreak = 0;
        LocalDate checkDate = todayActive ? today : today.minusDays(1);

        // If neither today nor yesterday is active, streak is broken
        if (!todayActive && !yesterdayActive) {
            currentStreak = 0;
        } else {
            while (activeDates.contains(checkDate)) {
                currentStreak++;
                checkDate = checkDate.minusDays(1);
            }
        }

        // Calculate longest streak
        int longestStreak = 0;
        int tempStreak = 1;
        for (int i = 0; i < activeDates.size() - 1; i++) {
            if (activeDates.get(i).minusDays(1).equals(activeDates.get(i + 1))) {
                tempStreak++;
            } else {
                longestStreak = Math.max(longestStreak, tempStreak);
                tempStreak = 1;
            }
        }
        longestStreak = Math.max(longestStreak, tempStreak);
        longestStreak = Math.max(longestStreak, currentStreak);

        // Determine status
        String status;
        boolean atRisk = false;
        if (currentStreak == 0) {
            status = "broken";
        } else if (todayActive) {
            status = currentStreak >= 7 ? "on_fire" : "active";
        } else {
            status = "at_risk";
            atRisk = true;
        }

        return StreakDTO.builder()
                .currentStreak(currentStreak)
                .longestStreak(longestStreak)
                .streakFreezes(2) // can be tracked per user later
                .todayActive(todayActive)
                .streakAtRisk(atRisk)
                .streakStatus(status)
                .build();
    }
}

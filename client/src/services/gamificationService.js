// client/src/services/gamificationService.js

import api from './api';

export const gamificationService = {
    getDashboard:      () => api.get('/gamification/dashboard'),
    getStreak:         () => api.get('/gamification/streak'),
    getXP:             () => api.get('/gamification/xp'),
    getAchievements:   () => api.get('/gamification/achievements'),
    getNewAchievements:() => api.get('/gamification/achievements/new'),
    markSeen:          () => api.post('/gamification/achievements/seen'),
    getHeatmap:        () => api.get('/gamification/heatmap'),

    // Record activity
    recordLogin:    () => api.post('/gamification/record/login'),
    recordTask:     () => api.post('/gamification/record/task'),
    recordNote:     () => api.post('/gamification/record/note'),
    recordStudy:    (minutes) => api.post('/gamification/record/study', { minutes }),
    recordPomodoro: () => api.post('/gamification/record/pomodoro'),
};

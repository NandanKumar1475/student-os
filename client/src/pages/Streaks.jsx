// client/src/pages/Streaks.jsx

import { useState, useEffect, useCallback } from 'react';
import { Flame, Trophy, Filter } from 'lucide-react';
import { gamificationService } from '../services/gamificationService';
import StreakHeroCard from '../components/gamification/StreakHeroCard';
import XPLevelCard from '../components/gamification/XPLevelCard';
import StreakCalendar from '../components/gamification/StreakCalendar';
import AchievementCard from '../components/gamification/AchievementCard';
import AchievementUnlockModal from '../components/gamification/AchievementUnlockModal';
import XPActivityFeed from '../components/gamification/XPActivityFeed';
import StatsGrid from '../components/gamification/StatsGrid';
import toast from 'react-hot-toast';

const ACHIEVEMENT_FILTERS = ['All', 'STREAK', 'TASK', 'NOTE', 'STUDY', 'POMODORO', 'XP'];

export default function Streaks() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [achievementFilter, setAchievementFilter] = useState('All');
    const [showUnlocked, setShowUnlocked] = useState('all'); // 'all' | 'unlocked' | 'locked'
    const [newAchievement, setNewAchievement] = useState(null);

    const fetchDashboard = useCallback(async () => {
        try {
            const res = await gamificationService.getDashboard();
            setDashboard(res.data);

            // Show first unseen achievement
            if (res.data.newAchievements?.length > 0) {
                setNewAchievement(res.data.newAchievements[0]);
                gamificationService.markSeen();
            }
        } catch {
            toast.error('Failed to load gamification data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

    // Record daily login on page visit
    useEffect(() => {
        gamificationService.recordLogin().catch(() => {});
    }, []);

    if (loading) {
        return (
            <div className="p-8 max-w-7xl mx-auto">
                <div className="animate-pulse space-y-6">
                    <div className="h-10 bg-white/5 rounded-xl w-64" />
                    <div className="h-36 bg-white/5 rounded-2xl" />
                    <div className="grid grid-cols-2 gap-5">
                        <div className="h-64 bg-white/5 rounded-2xl" />
                        <div className="h-64 bg-white/5 rounded-2xl" />
                    </div>
                </div>
            </div>
        );
    }

    const filteredAchievements = (dashboard?.achievements || []).filter(a => {
        const catMatch = achievementFilter === 'All' || a.category === achievementFilter;
        const statusMatch = showUnlocked === 'all'
            || (showUnlocked === 'unlocked' && a.unlocked)
            || (showUnlocked === 'locked' && !a.unlocked);
        return catMatch && statusMatch;
    });

    const unlockedCount = (dashboard?.achievements || []).filter(a => a.unlocked).length;
    const totalCount = (dashboard?.achievements || []).length;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Flame size={30} className="text-orange-400" />
                    Streaks & Achievements
                </h1>
                <p className="text-gray-400 mt-1">Track your consistency and unlock rewards</p>
            </div>

            {/* ── Streak Hero ── */}
            <StreakHeroCard streak={dashboard?.streak} />

            {/* ── XP Level + Activity Feed ── */}
            <div className="grid grid-cols-5 gap-5 mt-6">
                <div className="col-span-3">
                    <XPLevelCard xp={dashboard?.xp} />
                </div>
                <div className="col-span-2">
                    <XPActivityFeed transactions={dashboard?.xp?.recentTransactions} />
                </div>
            </div>

            {/* ── Heatmap ── */}
            <div className="mt-6">
                <StreakCalendar heatmap={dashboard?.heatmap} />
            </div>

            {/* ── Stats ── */}
            <div className="mt-6">
                <StatsGrid stats={dashboard?.stats} />
            </div>

            {/* ── Achievements Section ── */}
            <div className="mt-8">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <Trophy size={22} className="text-yellow-400" />
                        <h2 className="text-xl font-bold text-white">Achievements</h2>
                        <span className="text-xs text-gray-500 bg-white/5 px-2.5 py-1 rounded-full">
                            {unlockedCount} / {totalCount}
                        </span>
                    </div>

                    {/* Status filter */}
                    <div className="flex items-center gap-1 bg-white/5 rounded-lg p-0.5">
                        {['all', 'unlocked', 'locked'].map(s => (
                            <button key={s}
                                onClick={() => setShowUnlocked(s)}
                                className={`px-3 py-1.5 rounded-md text-xs transition capitalize
                                    ${showUnlocked === s
                                        ? 'bg-purple-600 text-white'
                                        : 'text-gray-500 hover:text-gray-300'}`}>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Category filters */}
                <div className="flex gap-2 mb-5 flex-wrap">
                    {ACHIEVEMENT_FILTERS.map(f => (
                        <button key={f}
                            onClick={() => setAchievementFilter(f)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition
                                ${achievementFilter === f
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200'}`}>
                            {f === 'All' ? '🏅 All' : f.charAt(0) + f.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>

                {/* Achievement Grid */}
                {filteredAchievements.length === 0 ? (
                    <div className="text-center py-12 text-gray-600">
                        <Trophy size={40} className="mx-auto mb-3 opacity-20" />
                        <p className="text-sm">No achievements match your filter</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredAchievements.map(a => (
                            <AchievementCard key={a.id} achievement={a} />
                        ))}
                    </div>
                )}
            </div>

            {/* ── Achievement Unlock Celebration ── */}
            {newAchievement && (
                <AchievementUnlockModal
                    achievement={newAchievement}
                    onClose={() => setNewAchievement(null)}
                />
            )}
        </div>
    );
}

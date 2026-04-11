// client/src/components/gamification/XPLevelCard.jsx

import { Zap, TrendingUp, Star } from 'lucide-react';

const RANK_COLORS = {
    'Newbie': 'from-gray-500 to-gray-600',
    'Beginner': 'from-green-600 to-green-700',
    'Apprentice': 'from-teal-500 to-teal-600',
    'Student': 'from-blue-500 to-blue-600',
    'Scholar': 'from-indigo-500 to-indigo-600',
    'Researcher': 'from-purple-500 to-purple-600',
    'Expert': 'from-violet-500 to-violet-600',
    'Master': 'from-orange-500 to-orange-600',
    'Grandmaster': 'from-red-500 to-red-600',
    'Legend': 'from-yellow-500 to-amber-500',
    'Mythic': 'from-pink-500 to-rose-500',
    'Immortal': 'from-cyan-400 to-blue-500',
    'Transcendent': 'from-amber-300 to-yellow-400',
};

export default function XPLevelCard({ xp }) {
    if (!xp) return null;

    const gradient = RANK_COLORS[xp.rank] || 'from-purple-500 to-blue-500';
    const progressPercent = Math.round((xp.levelProgress || 0) * 100);

    return (
        <div className="bg-[#0f1117] rounded-2xl border border-white/10 p-6 relative overflow-hidden">
            {/* Background glow */}
            <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full
                            bg-gradient-to-br ${gradient} opacity-10 blur-3xl`} />

            <div className="relative">
                {/* Level & Rank */}
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Level</p>
                        <div className="flex items-baseline gap-2">
                            <span className={`text-4xl font-black bg-gradient-to-r ${gradient}
                                            bg-clip-text text-transparent`}>
                                {xp.level}
                            </span>
                            <span className={`text-sm font-bold px-3 py-1 rounded-full
                                            bg-gradient-to-r ${gradient} text-white`}>
                                {xp.rank}
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-500 text-xs mb-1">Total XP</p>
                        <p className="text-2xl font-bold text-white flex items-center gap-1">
                            <Zap size={18} className="text-yellow-400" />
                            {xp.totalXP?.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* XP Progress Bar */}
                <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                        <span>Level {xp.level}</span>
                        <span>{xp.currentLevelXP?.toLocaleString()} / {xp.nextLevelXP?.toLocaleString()} XP</span>
                        <span>Level {xp.level + 1}</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className={`h-full bg-gradient-to-r ${gradient} rounded-full
                                       transition-all duration-1000 ease-out relative`}
                            style={{ width: `${progressPercent}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
                        </div>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-1 text-center">
                        {progressPercent}% to next level
                    </p>
                </div>

                {/* XP Stats Row */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/[0.03] rounded-xl p-3 text-center">
                        <p className="text-emerald-400 font-bold text-lg">{xp.xpToday || 0}</p>
                        <p className="text-gray-600 text-[10px] uppercase tracking-wider mt-0.5">Today</p>
                    </div>
                    <div className="bg-white/[0.03] rounded-xl p-3 text-center">
                        <p className="text-blue-400 font-bold text-lg">{xp.xpThisWeek || 0}</p>
                        <p className="text-gray-600 text-[10px] uppercase tracking-wider mt-0.5">This Week</p>
                    </div>
                    <div className="bg-white/[0.03] rounded-xl p-3 text-center">
                        <p className="text-purple-400 font-bold text-lg">{xp.xpThisMonth || 0}</p>
                        <p className="text-gray-600 text-[10px] uppercase tracking-wider mt-0.5">This Month</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

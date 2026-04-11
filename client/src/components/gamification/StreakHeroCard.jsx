// client/src/components/gamification/StreakHeroCard.jsx

import { Flame, Shield, AlertTriangle, Snowflake } from 'lucide-react';

const STATUS_CONFIG = {
    on_fire: {
        gradient: 'from-orange-500 via-red-500 to-yellow-500',
        glow: 'shadow-[0_0_60px_rgba(249,115,22,0.3)]',
        icon: Flame,
        label: 'ON FIRE!',
        message: "You're unstoppable!",
        textColor: 'text-orange-400',
    },
    active: {
        gradient: 'from-emerald-500 to-cyan-500',
        glow: 'shadow-[0_0_40px_rgba(16,185,129,0.2)]',
        icon: Shield,
        label: 'ACTIVE',
        message: 'Keep it going!',
        textColor: 'text-emerald-400',
    },
    at_risk: {
        gradient: 'from-yellow-500 to-orange-500',
        glow: 'shadow-[0_0_40px_rgba(234,179,8,0.2)]',
        icon: AlertTriangle,
        label: 'AT RISK',
        message: 'Complete a task today to save your streak!',
        textColor: 'text-yellow-400',
    },
    frozen: {
        gradient: 'from-blue-400 to-cyan-500',
        glow: 'shadow-[0_0_40px_rgba(56,189,248,0.2)]',
        icon: Snowflake,
        label: 'FROZEN',
        message: 'Streak freeze active',
        textColor: 'text-cyan-400',
    },
    broken: {
        gradient: 'from-gray-600 to-gray-700',
        glow: '',
        icon: Flame,
        label: 'NO STREAK',
        message: 'Start your streak today!',
        textColor: 'text-gray-400',
    },
};

export default function StreakHeroCard({ streak }) {
    if (!streak) return null;

    const status = STATUS_CONFIG[streak.streakStatus] || STATUS_CONFIG.broken;
    const StatusIcon = status.icon;

    return (
        <div className={`relative rounded-2xl border border-white/10 overflow-hidden
                        bg-[#0f1117] ${status.glow} transition-all duration-500`}>

            {/* Animated background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${status.gradient} opacity-[0.06]`} />

            {/* Floating particles for "on_fire" */}
            {streak.streakStatus === 'on_fire' && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                        <div key={i}
                            className="absolute w-1 h-1 bg-orange-400 rounded-full opacity-40"
                            style={{
                                left: `${15 + i * 15}%`,
                                bottom: '0%',
                                animation: `floatUp ${2 + i * 0.5}s ease-in-out infinite`,
                                animationDelay: `${i * 0.3}s`,
                            }} />
                    ))}
                </div>
            )}

            <div className="relative p-6">
                <div className="flex items-center justify-between">
                    {/* Left side - streak count */}
                    <div className="flex items-center gap-5">
                        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${status.gradient}
                                        flex items-center justify-center shadow-lg relative`}>
                            <StatusIcon size={36} className="text-white" />
                            {streak.streakStatus === 'on_fire' && (
                                <div className="absolute inset-0 rounded-2xl bg-white/10 animate-pulse" />
                            )}
                        </div>

                        <div>
                            <p className="text-xs uppercase tracking-[0.15em] text-gray-500 mb-1">
                                Daily Streak
                            </p>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-5xl font-black bg-gradient-to-r ${status.gradient}
                                                bg-clip-text text-transparent leading-none`}>
                                    {streak.currentStreak}
                                </span>
                                <span className="text-gray-500 text-lg font-medium">
                                    day{streak.currentStreak !== 1 ? 's' : ''}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1.5">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full
                                                bg-gradient-to-r ${status.gradient} text-white
                                                uppercase tracking-wider`}>
                                    {status.label}
                                </span>
                                <span className="text-gray-500 text-xs">{status.message}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right side - stats */}
                    <div className="flex gap-4">
                        <div className="text-center bg-white/[0.03] rounded-xl px-5 py-3">
                            <p className="text-2xl font-bold text-white">{streak.longestStreak}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">Longest</p>
                        </div>
                        <div className="text-center bg-white/[0.03] rounded-xl px-5 py-3">
                            <p className="text-2xl font-bold text-white flex items-center gap-1">
                                <Snowflake size={14} className="text-cyan-400" />
                                {streak.streakFreezes}
                            </p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">Freezes</p>
                        </div>
                        <div className="text-center bg-white/[0.03] rounded-xl px-5 py-3">
                            <div className={`w-4 h-4 mx-auto rounded-full mb-1
                                ${streak.todayActive
                                    ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                                    : 'bg-gray-700 border border-gray-600'}`} />
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Today</p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes floatUp {
                    0% { transform: translateY(0) scale(1); opacity: 0.4; }
                    50% { opacity: 0.8; }
                    100% { transform: translateY(-120px) scale(0); opacity: 0; }
                }
            `}</style>
        </div>
    );
}

// client/src/components/gamification/StatsGrid.jsx

import { Calendar, CheckSquare, FileText, Clock, Timer, Trophy } from 'lucide-react';

const STATS_CONFIG = [
    { key: 'totalActiveDays',       label: 'Active Days',     icon: Calendar,    color: 'text-emerald-400' },
    { key: 'totalTasksCompleted',   label: 'Tasks Done',      icon: CheckSquare, color: 'text-blue-400' },
    { key: 'totalNotesCreated',     label: 'Notes Created',   icon: FileText,    color: 'text-purple-400' },
    { key: 'totalStudyHours',       label: 'Study Hours',     icon: Clock,       color: 'text-cyan-400' },
    { key: 'totalPomodoroSessions', label: 'Pomodoros',       icon: Timer,       color: 'text-red-400' },
];

export default function StatsGrid({ stats }) {
    if (!stats) return null;

    return (
        <div className="bg-[#0f1117] rounded-2xl border border-white/10 p-6">
            <h3 className="text-white font-bold text-lg mb-4">Lifetime Stats</h3>

            <div className="grid grid-cols-5 gap-3">
                {STATS_CONFIG.map(s => {
                    const Icon = s.icon;
                    const value = stats[s.key] || 0;
                    return (
                        <div key={s.key}
                            className="bg-white/[0.03] rounded-xl p-4 text-center
                                       hover:bg-white/[0.05] transition group">
                            <Icon size={20}
                                className={`${s.color} mx-auto mb-2 group-hover:scale-110 transition`} />
                            <p className="text-2xl font-bold text-white">{value.toLocaleString()}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">
                                {s.label}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Achievement progress */}
            <div className="mt-4 flex items-center gap-3 bg-white/[0.03] rounded-xl p-3">
                <Trophy size={18} className="text-yellow-400" />
                <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Achievements Unlocked</span>
                        <span className="text-white font-medium">
                            {stats.achievementsUnlocked} / {stats.achievementsTotal}
                        </span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-yellow-500 to-amber-400 rounded-full transition-all"
                            style={{ width: `${stats.achievementsTotal > 0
                                ? (stats.achievementsUnlocked / stats.achievementsTotal * 100) : 0}%` }} />
                    </div>
                </div>
            </div>
        </div>
    );
}

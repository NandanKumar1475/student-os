// client/src/components/gamification/XPActivityFeed.jsx

import { Zap, CheckSquare, FileText, Clock, BookOpen, Trophy, LogIn, Target } from 'lucide-react';

const SOURCE_CONFIG = {
    TASK_COMPLETE:     { icon: CheckSquare, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    NOTE_CREATE:       { icon: FileText,    color: 'text-blue-400',    bg: 'bg-blue-500/10' },
    STUDY_SESSION:     { icon: BookOpen,    color: 'text-purple-400',  bg: 'bg-purple-500/10' },
    POMODORO:          { icon: Clock,       color: 'text-red-400',     bg: 'bg-red-500/10' },
    STREAK_BONUS:      { icon: Zap,         color: 'text-orange-400',  bg: 'bg-orange-500/10' },
    ACHIEVEMENT:       { icon: Trophy,      color: 'text-yellow-400',  bg: 'bg-yellow-500/10' },
    DAILY_LOGIN:       { icon: LogIn,       color: 'text-cyan-400',    bg: 'bg-cyan-500/10' },
    TARGET_COMPLETE:   { icon: Target,      color: 'text-pink-400',    bg: 'bg-pink-500/10' },
    CHALLENGE_COMPLETE:{ icon: Trophy,      color: 'text-amber-400',   bg: 'bg-amber-500/10' },
};

function timeAgo(dateStr) {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
}

export default function XPActivityFeed({ transactions = [] }) {
    return (
        <div className="bg-[#0f1117] rounded-2xl border border-white/10 p-6">
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <Zap size={18} className="text-yellow-400" />
                XP Activity
            </h3>

            {transactions.length === 0 ? (
                <p className="text-gray-600 text-sm text-center py-8">
                    No activity yet. Start earning XP!
                </p>
            ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar pr-1">
                    {transactions.map((tx, i) => {
                        const config = SOURCE_CONFIG[tx.source] || SOURCE_CONFIG.DAILY_LOGIN;
                        const Icon = config.icon;
                        return (
                            <div key={i}
                                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.02] transition">
                                <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center shrink-0`}>
                                    <Icon size={14} className={config.color} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-300 truncate">{tx.description}</p>
                                    <p className="text-[10px] text-gray-600">{timeAgo(tx.createdAt)}</p>
                                </div>
                                <span className="text-sm font-bold text-emerald-400 shrink-0">
                                    +{tx.amount}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

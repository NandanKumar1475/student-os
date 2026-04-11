// client/src/components/gamification/AchievementCard.jsx

import { Lock, Zap } from 'lucide-react';

const RARITY_STYLES = {
    COMMON:    { border: 'border-gray-700/50', glow: '', label: 'Common', labelBg: 'bg-gray-700 text-gray-300' },
    UNCOMMON:  { border: 'border-green-700/50', glow: 'shadow-[0_0_15px_rgba(34,197,94,0.08)]', label: 'Uncommon', labelBg: 'bg-green-900/60 text-green-400' },
    RARE:      { border: 'border-blue-600/50', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.1)]', label: 'Rare', labelBg: 'bg-blue-900/60 text-blue-400' },
    EPIC:      { border: 'border-purple-500/50', glow: 'shadow-[0_0_25px_rgba(168,85,247,0.12)]', label: 'Epic', labelBg: 'bg-purple-900/60 text-purple-400' },
    LEGENDARY: { border: 'border-yellow-500/50', glow: 'shadow-[0_0_30px_rgba(234,179,8,0.15)]', label: 'Legendary', labelBg: 'bg-yellow-900/60 text-yellow-400' },
};

export default function AchievementCard({ achievement }) {
    const a = achievement;
    const style = RARITY_STYLES[a.rarity] || RARITY_STYLES.COMMON;
    const progressPercent = Math.round((a.progress || 0) * 100);

    return (
        <div className={`relative rounded-2xl border ${style.border} ${style.glow}
                        bg-[#0f1117] p-4 transition-all duration-300
                        ${a.unlocked ? 'hover:scale-[1.02]' : 'opacity-60 hover:opacity-80'}
                        group cursor-default`}>

            {/* Rarity label */}
            <span className={`absolute -top-2 right-3 text-[9px] font-bold px-2 py-0.5
                            rounded-full ${style.labelBg} uppercase tracking-wider`}>
                {style.label}
            </span>

            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0
                    ${a.unlocked
                        ? 'bg-white/[0.06]'
                        : 'bg-white/[0.02]'}`}>
                    {a.unlocked ? a.icon : <Lock size={18} className="text-gray-600" />}
                </div>

                <div className="flex-1 min-w-0">
                    <h4 className={`font-bold text-sm truncate
                        ${a.unlocked ? 'text-white' : 'text-gray-500'}`}>
                        {a.title}
                    </h4>
                    <p className="text-gray-600 text-xs mt-0.5 line-clamp-1">
                        {a.description}
                    </p>

                    {/* Progress bar */}
                    {!a.unlocked && (
                        <div className="mt-2">
                            <div className="flex justify-between text-[10px] text-gray-600 mb-0.5">
                                <span>{a.currentValue || 0} / {a.targetValue}</span>
                                <span>{progressPercent}%</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-purple-600 to-cyan-500
                                               rounded-full transition-all duration-500"
                                    style={{ width: `${progressPercent}%` }} />
                            </div>
                        </div>
                    )}

                    {/* XP reward */}
                    {a.xpReward > 0 && (
                        <div className="flex items-center gap-1 mt-2">
                            <Zap size={10} className={a.unlocked ? 'text-yellow-400' : 'text-gray-600'} />
                            <span className={`text-[10px] font-medium
                                ${a.unlocked ? 'text-yellow-400' : 'text-gray-600'}`}>
                                {a.unlocked ? '+' : ''}{a.xpReward} XP
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

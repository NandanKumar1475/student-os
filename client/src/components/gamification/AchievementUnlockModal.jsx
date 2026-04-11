// client/src/components/gamification/AchievementUnlockModal.jsx

import { useEffect } from 'react';
import { X, Zap, Sparkles } from 'lucide-react';

const RARITY_GRADIENTS = {
    COMMON: 'from-gray-600 to-gray-700',
    UNCOMMON: 'from-green-600 to-emerald-700',
    RARE: 'from-blue-500 to-indigo-600',
    EPIC: 'from-purple-500 to-violet-600',
    LEGENDARY: 'from-yellow-400 to-amber-500',
};

export default function AchievementUnlockModal({ achievement, onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 6000); // auto close after 6s
        return () => clearTimeout(timer);
    }, [onClose]);

    if (!achievement) return null;

    const gradient = RARITY_GRADIENTS[achievement.rarity] || RARITY_GRADIENTS.COMMON;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center"
            onClick={onClose}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fadeIn" />

            {/* Card */}
            <div className="relative animate-bounceIn z-10"
                onClick={e => e.stopPropagation()}>

                {/* Glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient}
                                rounded-3xl blur-xl opacity-30 animate-pulse scale-110`} />

                <div className="relative bg-[#0f1117] rounded-3xl border border-white/10
                               p-8 text-center max-w-sm shadow-2xl">
                    {/* Close */}
                    <button onClick={onClose}
                        className="absolute top-4 right-4 text-gray-600 hover:text-white transition">
                        <X size={18} />
                    </button>

                    {/* Sparkle icon */}
                    <div className="flex justify-center mb-3">
                        <Sparkles size={24} className="text-yellow-400 animate-spin-slow" />
                    </div>

                    {/* Title */}
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3">
                        Achievement Unlocked!
                    </p>

                    {/* Badge */}
                    <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-4xl
                                   bg-gradient-to-br ${gradient} shadow-lg mb-4`}>
                        {achievement.icon}
                    </div>

                    {/* Name */}
                    <h2 className="text-xl font-black text-white mb-1">{achievement.title}</h2>
                    <p className="text-gray-400 text-sm mb-4">{achievement.description}</p>

                    {/* Rarity */}
                    <span className={`inline-block text-[10px] font-bold px-3 py-1 rounded-full
                                    bg-gradient-to-r ${gradient} text-white uppercase tracking-wider mb-4`}>
                        {achievement.rarity}
                    </span>

                    {/* XP Reward */}
                    {achievement.xpReward > 0 && (
                        <div className="flex items-center justify-center gap-2 bg-yellow-500/10
                                       rounded-xl py-2.5 px-4 border border-yellow-500/20">
                            <Zap size={16} className="text-yellow-400" />
                            <span className="text-yellow-400 font-bold">+{achievement.xpReward} XP</span>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes bounceIn {
                    0% { transform: scale(0.5) translateY(40px); opacity: 0; }
                    60% { transform: scale(1.05) translateY(-5px); opacity: 1; }
                    100% { transform: scale(1) translateY(0); }
                }
                @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
                .animate-bounceIn { animation: bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
                .animate-spin-slow { animation: spin-slow 3s linear infinite; }
            `}</style>
        </div>
    );
}

// client/src/components/gamification/StreakCalendar.jsx

import { useState } from 'react';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

const INTENSITY_COLORS = [
    'bg-white/[0.04]',                                    // 0 - none
    'bg-emerald-900/60 shadow-[0_0_4px_rgba(16,185,129,0.15)]',   // 1 - low
    'bg-emerald-700/70 shadow-[0_0_6px_rgba(16,185,129,0.2)]',    // 2 - medium
    'bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.3)]',    // 3 - high
    'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.4)]',      // 4 - max
];

export default function StreakCalendar({ heatmap = [] }) {
    const [tooltip, setTooltip] = useState(null);

    // Build lookup map
    const activityMap = {};
    heatmap.forEach(d => { activityMap[d.date] = d; });

    // Generate 365 days grid
    const today = new Date();
    const days = [];
    for (let i = 364; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const key = date.toISOString().split('T')[0];
        const activity = activityMap[key];
        days.push({
            date: key,
            day: date.getDay(),
            month: date.getMonth(),
            intensity: activity?.intensity || 0,
            xp: activity?.xpEarned || 0,
            tasks: activity?.tasksCompleted || 0,
            notes: activity?.notesCreated || 0,
            study: activity?.studyMinutes || 0,
            pomodoro: activity?.pomodoroSessions || 0,
        });
    }

    // Group into weeks (columns)
    const weeks = [];
    let currentWeek = new Array(7).fill(null);
    days.forEach((day, i) => {
        currentWeek[day.day] = day;
        if (day.day === 6 || i === days.length - 1) {
            weeks.push(currentWeek);
            currentWeek = new Array(7).fill(null);
        }
    });

    // Month labels
    const monthLabels = [];
    let lastMonth = -1;
    weeks.forEach((week, i) => {
        const firstDay = week.find(d => d !== null);
        if (firstDay && firstDay.month !== lastMonth) {
            monthLabels.push({ month: MONTHS[firstDay.month], col: i });
            lastMonth = firstDay.month;
        }
    });

    const activeDays = days.filter(d => d.intensity > 0).length;
    const totalXP = days.reduce((sum, d) => sum + d.xp, 0);

    return (
        <div className="bg-[#0f1117] rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-lg">Activity Heatmap</h3>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{activeDays} active days</span>
                    <span>{totalXP.toLocaleString()} XP earned</span>
                </div>
            </div>

            <div className="overflow-x-auto pb-2">
                <div className="inline-block min-w-full">
                    {/* Month labels */}
                    <div className="flex ml-8 mb-1">
                        {monthLabels.map((m, i) => (
                            <span key={i} className="text-[10px] text-gray-600 absolute"
                                style={{ marginLeft: m.col * 15 }}>
                                {m.month}
                            </span>
                        ))}
                    </div>

                    <div className="flex gap-[1px] mt-5 relative">
                        {/* Day labels */}
                        <div className="flex flex-col gap-[1px] mr-2 shrink-0">
                            {DAYS.map((d, i) => (
                                <span key={i} className="text-[9px] text-gray-600 h-[13px] flex items-center">
                                    {d}
                                </span>
                            ))}
                        </div>

                        {/* Grid */}
                        {weeks.map((week, wi) => (
                            <div key={wi} className="flex flex-col gap-[1px]">
                                {week.map((day, di) => (
                                    <div key={di}
                                        className={`w-[13px] h-[13px] rounded-[2px] transition-all duration-150
                                            ${day ? INTENSITY_COLORS[day.intensity] : 'bg-transparent'}
                                            ${day ? 'cursor-pointer hover:ring-1 hover:ring-white/30 hover:scale-125' : ''}`}
                                        onMouseEnter={() => day && setTooltip(day)}
                                        onMouseLeave={() => setTooltip(null)}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2 text-[10px] text-gray-600">
                    <span>Less</span>
                    {INTENSITY_COLORS.map((c, i) => (
                        <div key={i} className={`w-[11px] h-[11px] rounded-[2px] ${c}`} />
                    ))}
                    <span>More</span>
                </div>

                {/* Tooltip */}
                {tooltip && (
                    <div className="text-xs text-gray-400 bg-[#1a1f2e] border border-white/10
                                    rounded-lg px-3 py-2 shadow-xl">
                        <span className="text-white font-medium">{tooltip.date}</span>
                        <span className="mx-2">·</span>
                        <span className="text-emerald-400">{tooltip.xp} XP</span>
                        {tooltip.tasks > 0 && <span className="mx-1">· {tooltip.tasks} tasks</span>}
                        {tooltip.study > 0 && <span className="mx-1">· {tooltip.study}m study</span>}
                        {tooltip.pomodoro > 0 && <span className="mx-1">· {tooltip.pomodoro} pomodoro</span>}
                    </div>
                )}
            </div>
        </div>
    );
}

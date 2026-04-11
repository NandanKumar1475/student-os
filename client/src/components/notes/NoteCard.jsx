// client/src/components/notes/NoteCard.jsx

import { Pin, Clock } from 'lucide-react';

function timeAgo(dateStr) {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hours ago`;
    const days = Math.floor(hrs / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
}

export default function NoteCard({ note, isActive, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`p-4 rounded-xl cursor-pointer transition-all border
                ${isActive
                    ? 'bg-cyan-400/12 border-cyan-300/30 shadow-[0_10px_24px_rgba(123,226,255,0.08)]'
                    : 'bg-transparent border-transparent hover:bg-white/5'}`}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                    <h3 className={`font-semibold text-sm truncate ${isActive ? 'text-white' : 'text-gray-200'}`}>
                        {note.title}
                    </h3>
                </div>
                {note.pinned && <Pin size={14} className="text-purple-400 shrink-0 mt-0.5" />}
            </div>

            <p className="text-gray-500 text-xs mt-1.5 line-clamp-1">
                {note.preview || 'No content...'}
            </p>

            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                {note.tags?.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-medium">
                        #{tag}
                    </span>
                ))}
                <span className="text-[10px] text-gray-600 flex items-center gap-1 ml-auto">
                    <Clock size={10} />
                    {timeAgo(note.updatedAt)}
                </span>
            </div>
        </div>
    );
}

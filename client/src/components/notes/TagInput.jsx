// client/src/components/notes/TagInput.jsx

import { useState, useRef, useEffect } from 'react';
import { X, Tag, Hash } from 'lucide-react';

const SUGGESTED_TAGS = ['DSA', 'Java', 'React', 'JavaScript', 'SQL', 'DBMS', 'OS', 'SystemDesign', 'Trees', 'Graphs', 'DP', 'Arrays', 'LinkedList', 'OOP', 'Spring', 'CSS', 'Interview'];

export default function TagInput({ tags = [], onChange }) {
    const [input, setInput] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const filtered = SUGGESTED_TAGS.filter(
        t => t.toLowerCase().includes(input.toLowerCase()) && !tags.includes(t)
    );

    const addTag = (tag) => {
        const clean = tag.trim().replace(/^#/, '');
        if (clean && !tags.includes(clean)) {
            onChange([...tags, clean]);
        }
        setInput('');
        setShowSuggestions(false);
        inputRef.current?.focus();
    };

    const removeTag = (tag) => {
        onChange(tags.filter(t => t !== tag));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && input.trim()) {
            e.preventDefault();
            addTag(input);
        } else if (e.key === 'Backspace' && !input && tags.length > 0) {
            removeTag(tags[tags.length - 1]);
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    return (
        <div ref={containerRef} className="relative">
            <div className="flex items-center gap-1.5 flex-wrap">
                {tags.map(tag => (
                    <span key={tag}
                        className="group flex items-center gap-1 text-xs px-2.5 py-1 rounded-full
                                   bg-linear-to-r from-purple-500/20 to-cyan-500/20
                                   text-purple-300 border border-purple-500/20
                                   hover:border-purple-400/40 transition-all">
                        <Hash size={10} className="text-purple-400" />
                        {tag}
                        <button onClick={() => removeTag(tag)}
                            className="opacity-50 group-hover:opacity-100 hover:text-red-400 transition">
                            <X size={10} />
                        </button>
                    </span>
                ))}
                <div className="relative flex items-center gap-1">
                    <Tag size={12} className="text-gray-600" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder={tags.length === 0 ? "Add tags..." : ""}
                        className="bg-transparent text-xs text-gray-400 w-24 focus:outline-none
                                   placeholder-gray-600 focus:w-32 transition-all"
                        value={input}
                        onChange={e => { setInput(e.target.value); setShowSuggestions(true); }}
                        onFocus={() => setShowSuggestions(true)}
                        onKeyDown={handleKeyDown}
                    />
                </div>
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && (input || filtered.length > 0) && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-[#1a1f2e] border border-white/10
                                rounded-xl shadow-2xl z-50 py-1 max-h-48 overflow-y-auto custom-scrollbar">
                    {input && !SUGGESTED_TAGS.some(t => t.toLowerCase() === input.toLowerCase()) && (
                        <button onClick={() => addTag(input)}
                            className="w-full px-3 py-2 text-left text-xs text-gray-300 hover:bg-white/5
                                       flex items-center gap-2 transition">
                            <Hash size={12} className="text-purple-400" />
                            Create "{input}"
                        </button>
                    )}
                    {filtered.slice(0, 8).map(tag => (
                        <button key={tag} onClick={() => addTag(tag)}
                            className="w-full px-3 py-2 text-left text-xs text-gray-400 hover:bg-white/5
                                       hover:text-white flex items-center gap-2 transition">
                            <Hash size={12} className="text-gray-600" />
                            {tag}
                        </button>
                    ))}
                    {filtered.length === 0 && !input && (
                        <p className="px-3 py-2 text-xs text-gray-600">Type to search tags</p>
                    )}
                </div>
            )}
        </div>
    );
}

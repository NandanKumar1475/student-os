// client/src/pages/Notes.jsx

import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, FileText, Hash, X, SortAsc, Filter } from 'lucide-react';
import { noteService } from '../services/noteService';
import { gamificationService } from '../services/gamificationService';
import NoteCard from '../components/notes/NoteCard';
import NoteEditor from '../components/notes/NoteEditor';
import toast from 'react-hot-toast';

export default function Notes() {
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [allTags, setAllTags] = useState([]);
    const [activeTag, setActiveTag] = useState(null);
    const [showTagFilter, setShowTagFilter] = useState(false);

    const fetchNoteById = useCallback(async (id) => {
        const res = await noteService.getById(id);
        return res.data;
    }, []);

    const loadFullNote = useCallback(async (id) => {
        try {
            const data = await fetchNoteById(id);
            setSelectedNote(data);
        } catch {
            toast.error('Failed to load note');
        }
    }, [fetchNoteById]);

    const fetchNotesData = useCallback(async () => {
        if (searchQuery) {
            const res = await noteService.search(searchQuery);
            return res.data;
        }
        if (activeTag) {
            const res = await noteService.getByTag(activeTag);
            return res.data;
        }
        const res = await noteService.getAll();
        return res.data;
    }, [searchQuery, activeTag]);

    const loadNotes = useCallback(async () => {
        try {
            const data = await fetchNotesData();
            setNotes(data);
        } catch {
            toast.error('Failed to load notes');
        }
    }, [fetchNotesData]);

    const fetchTagsData = useCallback(async () => {
        const res = await noteService.getTags();
        return res.data;
    }, []);

    const loadTags = useCallback(async () => {
        try {
            const data = await fetchTagsData();
            setAllTags(data);
        } catch {
            /* silent */
        }
    }, [fetchTagsData]);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchNotesData();
                setNotes(data);
            } catch {
                toast.error('Failed to load notes');
            }
        };
        void load();
    }, [fetchNotesData]);

    useEffect(() => {
        if (notes.length > 0 && !selectedNote) {
            const load = async () => {
                try {
                    const data = await fetchNoteById(notes[0].id);
                    setSelectedNote(data);
                } catch {
                    toast.error('Failed to load note');
                }
            };
            void load();
        }
    }, [notes, selectedNote, fetchNoteById]);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchTagsData();
                setAllTags(data);
            } catch {
                /* silent */
            }
        };
        void load();
    }, [fetchTagsData]);

    const handleCreate = async () => {
        try {
            const res = await noteService.create({
                title: 'Untitled Note',
                content: '',
                tags: activeTag ? [activeTag] : [],
            });
            gamificationService.recordNote();
            await loadNotes();
            setSelectedNote(res.data);
            toast.success('Note created!');
        } catch {
            toast.error('Failed to create note');
        }
    };

    const handleUpdated = async () => {
        try {
            await Promise.all([loadNotes(), loadTags()]);
            if (selectedNote) {
                const refreshed = await fetchNoteById(selectedNote.id);
                setSelectedNote(refreshed);
            }
        } catch {
            toast.error('Failed to refresh note data');
        }
    };

    const handleDeleted = async () => {
        setSelectedNote(null);
        await Promise.all([loadNotes(), loadTags()]);
    };

    const handleTagClick = (tag) => {
        if (activeTag === tag) {
            setActiveTag(null);
        } else {
            setActiveTag(tag);
            setSearchQuery('');
        }
    };

    const clearFilters = () => {
        setActiveTag(null);
        setSearchQuery('');
    };

    const pinnedCount = notes.filter(n => n.pinned).length;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        Notes <FileText size={28} className="text-yellow-400" />
                    </h1>
                    <p className="text-gray-400 mt-1">Your study notes and documentation</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                               bg-purple-600 hover:bg-purple-700 text-white font-semibold
                               transition shadow-lg shadow-purple-500/20">
                    <Plus size={18} /> New Note
                </button>
            </div>

            {/* Two-panel layout */}
            <div className="flex gap-5 h-[calc(100vh-200px)]">

                {/* ── Left Panel ── */}
                <div className="w-80 shrink-0 flex flex-col">
                    {/* Search */}
                    <div className="relative mb-3">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search notes..."
                            className="w-full pl-10 pr-10 py-2.5 bg-[#1a1f2e] border border-white/10
                                       rounded-xl text-white text-sm placeholder-gray-500
                                       focus:outline-none focus:border-purple-500/50 transition"
                            value={searchQuery}
                            onChange={e => { setSearchQuery(e.target.value); setActiveTag(null); }}
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    {/* Tag filter toggle */}
                    <button onClick={() => setShowTagFilter(!showTagFilter)}
                        className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300
                                   mb-2 px-1 transition">
                        <Filter size={12} />
                        {showTagFilter ? 'Hide' : 'Filter by'} tags
                        {activeTag && (
                            <span className="ml-auto text-purple-400 flex items-center gap-1">
                                #{activeTag}
                                <button onClick={(e) => { e.stopPropagation(); clearFilters(); }}
                                    className="hover:text-red-400">
                                    <X size={10} />
                                </button>
                            </span>
                        )}
                    </button>

                    {/* Tag chips */}
                    {showTagFilter && allTags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3 pb-3 border-b border-white/5">
                            {allTags.map(tag => (
                                <button key={tag}
                                    onClick={() => handleTagClick(tag)}
                                    className={`text-[11px] px-2.5 py-1 rounded-full transition flex items-center gap-1
                                        ${activeTag === tag
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200'}`}>
                                    <Hash size={9} />
                                    {tag}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Notes count */}
                    <div className="flex items-center justify-between text-[11px] text-gray-600 mb-2 px-1">
                        <span>{notes.length} note{notes.length !== 1 ? 's' : ''}
                            {pinnedCount > 0 && ` · ${pinnedCount} pinned`}
                        </span>
                    </div>

                    {/* Notes list */}
                    <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                        {notes.length === 0 ? (
                            <div className="text-center py-16 text-gray-600">
                                <FileText size={40} className="mx-auto mb-3 opacity-20" />
                                <p className="text-sm">
                                    {searchQuery || activeTag ? 'No matching notes' : 'No notes yet'}
                                </p>
                                {(searchQuery || activeTag) && (
                                    <button onClick={clearFilters}
                                        className="mt-2 text-xs text-purple-400 hover:text-purple-300">
                                        Clear filters
                                    </button>
                                )}
                            </div>
                        ) : (
                            notes.map(note => (
                                <NoteCard
                                    key={note.id}
                                    note={note}
                                    isActive={selectedNote?.id === note.id}
                                    onClick={() => loadFullNote(note.id)}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* ── Right Panel ── */}
                <NoteEditor
                    note={selectedNote}
                    onUpdated={handleUpdated}
                    onDeleted={handleDeleted}
                />
            </div>
        </div>
    );
}

// client/src/components/notes/NoteEditor.jsx

import { useState, useEffect, useRef, useCallback } from 'react';
import {
    Pin, PinOff, Trash2, Save, Bold, Italic, Heading1, Heading2, Heading3,
    Code, List, ListOrdered, Quote, Minus, Link2, Image, CheckSquare,
    Eye, Edit3, Clock, FileText, Undo2, Redo2, Copy, Download,
    Maximize2, Minimize2, AlignLeft
} from 'lucide-react';
import { noteService } from '../../services/noteService';
import TagInput from './TagInput';
import toast from 'react-hot-toast';

// ── Markdown Preview Renderer ──
function renderMarkdown(text) {
    if (!text) return '<p class="text-gray-600 italic">Nothing to preview...</p>';
    let html = text
        // Code blocks
        .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-[#0d1117] border border-white/10 rounded-lg p-4 my-3 overflow-x-auto"><code class="text-green-400 text-sm font-mono">$2</code></pre>')
        // Inline code
        .replace(/`([^`]+)`/g, '<code class="bg-purple-500/15 text-purple-300 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
        // Headers
        .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-white mt-5 mb-2">$1</h3>')
        .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-white mt-6 mb-2 pb-1 border-b border-white/10">$1</h2>')
        .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-white mt-6 mb-3">$1</h1>')
        // Bold & Italic
        .replace(/\*\*\*(.+?)\*\*\*/g, '<strong class="text-white"><em>$1</em></strong>')
        .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>')
        .replace(/\*(.+?)\*/g, '<em class="text-gray-200">$1</em>')
        // Strikethrough
        .replace(/~~(.+?)~~/g, '<del class="text-gray-500">$1</del>')
        // Blockquote
        .replace(/^> (.+)$/gm, '<blockquote class="border-l-3 border-purple-500 pl-4 my-3 text-gray-400 italic">$1</blockquote>')
        // Horizontal rule
        .replace(/^---$/gm, '<hr class="border-white/10 my-5" />')
        // Checkboxes
        .replace(/^- \[x\] (.+)$/gm, '<div class="flex items-center gap-2 my-1"><span class="w-4 h-4 rounded bg-purple-600 flex items-center justify-center text-white text-xs">✓</span><span class="text-gray-400 line-through">$1</span></div>')
        .replace(/^- \[ \] (.+)$/gm, '<div class="flex items-center gap-2 my-1"><span class="w-4 h-4 rounded border border-white/20"></span><span class="text-gray-300">$1</span></div>')
        // Unordered list
        .replace(/^- (.+)$/gm, '<div class="flex gap-2 my-0.5 ml-2"><span class="text-purple-400 mt-0.5">•</span><span class="text-gray-300">$1</span></div>')
        // Ordered list
        .replace(/^(\d+)\. (.+)$/gm, '<div class="flex gap-2 my-0.5 ml-2"><span class="text-purple-400 font-mono text-sm min-w-5">$1.</span><span class="text-gray-300">$2</span></div>')
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-cyan-400 hover:text-cyan-300 underline underline-offset-2">$1</a>')
        // Images
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-lg max-w-full my-3 border border-white/10" />')
        // Line breaks → paragraphs
        .replace(/\n\n/g, '</p><p class="text-gray-300 my-2 leading-relaxed">')
        .replace(/\n/g, '<br/>');

    return `<p class="text-gray-300 my-2 leading-relaxed">${html}</p>`;
}

// ── Toolbar Button ──
function ToolBtn({ icon, label, onClick, active }) {
    const Icon = icon;
    return (
        <button onClick={onClick} title={label}
            className={`p-1.5 rounded-md transition-all ${active
                ? 'bg-purple-500/30 text-purple-300'
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}>
            <Icon size={15} />
        </button>
    );
}

// ── Slash Command Menu ──
const SLASH_COMMANDS = [
    { cmd: 'h1', label: 'Heading 1', icon: Heading1, insert: '# ' },
    { cmd: 'h2', label: 'Heading 2', icon: Heading2, insert: '## ' },
    { cmd: 'h3', label: 'Heading 3', icon: Heading3, insert: '### ' },
    { cmd: 'bullet', label: 'Bullet List', icon: List, insert: '- ' },
    { cmd: 'numbered', label: 'Numbered List', icon: ListOrdered, insert: '1. ' },
    { cmd: 'todo', label: 'To-do', icon: CheckSquare, insert: '- [ ] ' },
    { cmd: 'quote', label: 'Quote', icon: Quote, insert: '> ' },
    { cmd: 'code', label: 'Code Block', icon: Code, insert: '```\n\n```' },
    { cmd: 'divider', label: 'Divider', icon: Minus, insert: '\n---\n' },
    { cmd: 'link', label: 'Link', icon: Link2, insert: '[text](url)' },
    { cmd: 'image', label: 'Image', icon: Image, insert: '![alt](url)' },
];

export default function NoteEditor({ note, onUpdated, onDeleted }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState([]);
    const [dirty, setDirty] = useState(false);
    const [prevNoteId, setPrevNoteId] = useState(null);
    const [mode, setMode] = useState('write'); // 'write' | 'preview' | 'split'
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showSlash, setShowSlash] = useState(false);
    const [slashFilter, setSlashFilter] = useState('');
    const [slashIndex, setSlashIndex] = useState(0);
    const [history, setHistory] = useState([]);
    const [historyIdx, setHistoryIdx] = useState(-1);

    const textareaRef = useRef(null);
    const autoSaveTimer = useRef(null);
    const slashPos = useRef(null);

    // Sync state from prop
    if (note && note.id !== prevNoteId) {
        setPrevNoteId(note.id);
        setTitle(note.title || '');
        setContent(note.content || '');
        setTags(note.tags || []);
        setDirty(false);
        setHistory([note.content || '']);
        setHistoryIdx(0);
    }
    if (!note && prevNoteId !== null) {
        setPrevNoteId(null);
    }

    const pushHistory = useCallback((val) => {
        const newHist = history.slice(0, historyIdx + 1);
        newHist.push(val);
        if (newHist.length > 50) newHist.shift();
        setHistory(newHist);
        setHistoryIdx(newHist.length - 1);
    }, [history, historyIdx]);

    const undo = useCallback(() => {
        if (historyIdx > 0) {
            setHistoryIdx(historyIdx - 1);
            setContent(history[historyIdx - 1]);
            setDirty(true);
        }
    }, [history, historyIdx]);

    const redo = useCallback(() => {
        if (historyIdx < history.length - 1) {
            setHistoryIdx(historyIdx + 1);
            setContent(history[historyIdx + 1]);
            setDirty(true);
        }
    }, [history, historyIdx]);

    const wrapSelection = useCallback((before, after) => {
        const ta = textareaRef.current;
        if (!ta) return;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const selected = content.substring(start, end) || 'text';
        const newContent = content.substring(0, start) + before + selected + after + content.substring(end);
        setContent(newContent);
        pushHistory(newContent);
        setDirty(true);
        setTimeout(() => {
            ta.focus();
            ta.setSelectionRange(start + before.length, start + before.length + selected.length);
        }, 0);
    }, [content, pushHistory]);

    const insertAtCursor = (text) => {
        const ta = textareaRef.current;
        if (!ta) return;
        const start = ta.selectionStart;
        const newContent = content.substring(0, start) + text + content.substring(start);
        setContent(newContent);
        pushHistory(newContent);
        setDirty(true);
        setTimeout(() => {
            ta.focus();
            ta.setSelectionRange(start + text.length, start + text.length);
        }, 0);
    };

    const prependLine = (prefix) => {
        const ta = textareaRef.current;
        if (!ta) return;
        const start = ta.selectionStart;
        const lineStart = content.lastIndexOf('\n', start - 1) + 1;
        const newContent = content.substring(0, lineStart) + prefix + content.substring(lineStart);
        setContent(newContent);
        pushHistory(newContent);
        setDirty(true);
    };

    const executeSlashCommand = (cmd) => {
        const ta = textareaRef.current;
        const start = slashPos.current;
        const cursorPos = ta.selectionStart;
        const newContent = content.substring(0, start) + cmd.insert + content.substring(cursorPos);
        setContent(newContent);
        pushHistory(newContent);
        setDirty(true);
        setShowSlash(false);
        setTimeout(() => {
            ta.focus();
            const newPos = start + cmd.insert.length;
            ta.setSelectionRange(newPos, newPos);
        }, 0);
    };

    const handleContentChange = (e) => {
        const val = e.target.value;
        setContent(val);
        pushHistory(val);
        setDirty(true);

        // Detect slash command
        const cursorPos = e.target.selectionStart;
        const textBefore = val.substring(0, cursorPos);
        const lastSlash = textBefore.lastIndexOf('/');

        if (lastSlash >= 0) {
            const afterSlash = textBefore.substring(lastSlash + 1);
            if (!afterSlash.includes(' ') && !afterSlash.includes('\n')) {
                setShowSlash(true);
                setSlashFilter(afterSlash.toLowerCase());
                setSlashIndex(0);
                slashPos.current = lastSlash;
                return;
            }
        }
        setShowSlash(false);
    };

    const filteredSlash = SLASH_COMMANDS.filter(c =>
        c.cmd.includes(slashFilter) || c.label.toLowerCase().includes(slashFilter)
    );

    const handleTextareaKeyDown = (e) => {
        if (showSlash) {
            if (e.key === 'ArrowDown') { e.preventDefault(); setSlashIndex(i => Math.min(i + 1, filteredSlash.length - 1)); }
            if (e.key === 'ArrowUp') { e.preventDefault(); setSlashIndex(i => Math.max(i - 1, 0)); }
            if (e.key === 'Enter') { e.preventDefault(); if (filteredSlash[slashIndex]) executeSlashCommand(filteredSlash[slashIndex]); }
            if (e.key === 'Escape') { setShowSlash(false); }
            return;
        }
        // Tab indent
        if (e.key === 'Tab') {
            e.preventDefault();
            insertAtCursor('  ');
        }
    };

    const handleSave = useCallback(async () => {
        if (!note) return;
        if (!title.trim()) return toast.error('Title is required');
        try {
            clearTimeout(autoSaveTimer.current);
            await noteService.update(note.id, { title, content, tags });
            toast.success('Saved!');
            setDirty(false);
            onUpdated();
        } catch {
            toast.error('Failed to save');
        }
    }, [note, title, content, tags, onUpdated]);

    // ── Auto-save (3 seconds after last edit) ──
    useEffect(() => {
        if (!dirty || !note) return;
        autoSaveTimer.current = setTimeout(async () => {
            try {
                await noteService.update(note.id, { title, content, tags });
                setDirty(false);
                onUpdated();
            } catch { /* silent */ }
        }, 3000);
        return () => clearTimeout(autoSaveTimer.current);
    }, [dirty, title, content, tags, note, onUpdated]);

    // ── Keyboard shortcuts ──
    useEffect(() => {
        const handler = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                handleSave();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                e.preventDefault();
                wrapSelection('**', '**');
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
                e.preventDefault();
                wrapSelection('*', '*');
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                undo();
            }
            if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
                e.preventDefault();
                redo();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [handleSave, wrapSelection, undo, redo]);

    const handlePin = async () => {
        await noteService.togglePin(note.id);
        toast.success(note.pinned ? 'Unpinned' : 'Pinned');
        onUpdated();
    };

    const handleDelete = async () => {
        if (!confirm('Delete this note permanently?')) return;
        await noteService.delete(note.id);
        toast.success('Note deleted');
        onDeleted();
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        toast.success('Copied to clipboard');
    };

    const handleExport = () => {
        const blob = new Blob([`# ${title}\n\n${content}`], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/\s+/g, '_')}.md`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Exported as Markdown');
    };

    // ── Stats ──
    const wordCount = content ? content.trim().split(/\s+/).filter(Boolean).length : 0;
    const charCount = content ? content.length : 0;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    if (!note) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-600 gap-3">
                <FileText size={48} className="opacity-20" />
                <p className="text-sm">Select a note or create a new one</p>
                <p className="text-xs text-gray-700">Use <kbd className="px-1.5 py-0.5 bg-white/5 rounded text-[10px] border border-white/10">/ </kbd> for slash commands</p>
            </div>
        );
    }

    const editorContainerClass = isFullscreen
        ? 'fixed inset-0 z-50 bg-[#0a0d14] flex flex-col'
        : 'flex-1 flex flex-col bg-[#0f1117] rounded-2xl border border-white/10 overflow-hidden';

    return (
        <div className={editorContainerClass}>
            {/* ── Top Toolbar ── */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-[#0f1117]/80 backdrop-blur">
                {/* Tags */}
                <div className="flex-1 min-w-0">
                    <TagInput tags={tags} onChange={(t) => { setTags(t); setDirty(true); }} />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 ml-3 shrink-0">
                    {dirty && (
                        <button onClick={handleSave}
                            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg
                                       bg-purple-600 hover:bg-purple-700 text-white transition
                                       animate-pulse">
                            <Save size={12} /> Save
                        </button>
                    )}
                    {!dirty && note && (
                        <span className="text-[10px] text-green-500/60 px-2">✓ Saved</span>
                    )}
                    <button onClick={handlePin}
                        className="text-gray-500 hover:text-purple-400 transition p-1.5"
                        title={note.pinned ? 'Unpin' : 'Pin'}>
                        {note.pinned ? <PinOff size={15} /> : <Pin size={15} />}
                    </button>
                    <button onClick={handleCopy}
                        className="text-gray-500 hover:text-gray-300 transition p-1.5" title="Copy">
                        <Copy size={15} />
                    </button>
                    <button onClick={handleExport}
                        className="text-gray-500 hover:text-gray-300 transition p-1.5" title="Export .md">
                        <Download size={15} />
                    </button>
                    <button onClick={() => setIsFullscreen(!isFullscreen)}
                        className="text-gray-500 hover:text-gray-300 transition p-1.5" title="Fullscreen">
                        {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                    </button>
                    <button onClick={handleDelete}
                        className="text-gray-500 hover:text-red-400 transition p-1.5" title="Delete">
                        <Trash2 size={15} />
                    </button>
                </div>
            </div>

            {/* ── Formatting Toolbar ── */}
            <div className="flex items-center gap-0.5 px-4 py-1.5 border-b border-white/5 bg-[#0d0f14]/50">
                <ToolBtn icon={Undo2} label="Undo (Ctrl+Z)" onClick={undo} />
                <ToolBtn icon={Redo2} label="Redo (Ctrl+Y)" onClick={redo} />
                <div className="w-px h-4 bg-white/10 mx-1" />
                <ToolBtn icon={Bold} label="Bold (Ctrl+B)" onClick={() => wrapSelection('**', '**')} />
                <ToolBtn icon={Italic} label="Italic (Ctrl+I)" onClick={() => wrapSelection('*', '*')} />
                <ToolBtn icon={Code} label="Inline Code" onClick={() => wrapSelection('`', '`')} />
                <div className="w-px h-4 bg-white/10 mx-1" />
                <ToolBtn icon={Heading1} label="H1" onClick={() => prependLine('# ')} />
                <ToolBtn icon={Heading2} label="H2" onClick={() => prependLine('## ')} />
                <ToolBtn icon={Heading3} label="H3" onClick={() => prependLine('### ')} />
                <div className="w-px h-4 bg-white/10 mx-1" />
                <ToolBtn icon={List} label="Bullet List" onClick={() => prependLine('- ')} />
                <ToolBtn icon={ListOrdered} label="Numbered List" onClick={() => prependLine('1. ')} />
                <ToolBtn icon={CheckSquare} label="Checkbox" onClick={() => prependLine('- [ ] ')} />
                <ToolBtn icon={Quote} label="Quote" onClick={() => prependLine('> ')} />
                <ToolBtn icon={Minus} label="Divider" onClick={() => insertAtCursor('\n---\n')} />
                <ToolBtn icon={Link2} label="Link" onClick={() => wrapSelection('[', '](url)')} />

                {/* View mode toggles */}
                <div className="ml-auto flex items-center gap-0.5 bg-white/5 rounded-lg p-0.5">
                    <button onClick={() => setMode('write')}
                        className={`px-2.5 py-1 rounded-md text-xs transition ${mode === 'write' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                        <Edit3 size={12} className="inline mr-1" />Write
                    </button>
                    <button onClick={() => setMode('preview')}
                        className={`px-2.5 py-1 rounded-md text-xs transition ${mode === 'preview' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                        <Eye size={12} className="inline mr-1" />Preview
                    </button>
                    <button onClick={() => setMode('split')}
                        className={`px-2.5 py-1 rounded-md text-xs transition ${mode === 'split' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                        <AlignLeft size={12} className="inline mr-1" />Split
                    </button>
                </div>
            </div>

            {/* ── Title ── */}
            <input
                type="text"
                className="px-6 pt-5 pb-2 text-2xl font-bold text-white bg-transparent
                           focus:outline-none border-none"
                placeholder="Untitled Note"
                value={title}
                onChange={e => { setTitle(e.target.value); setDirty(true); }}
            />

            {/* ── Editor Area ── */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Write / Split left */}
                {(mode === 'write' || mode === 'split') && (
                    <div className={`relative ${mode === 'split' ? 'w-1/2 border-r border-white/5' : 'w-full'} flex flex-col`}>
                        <textarea
                            ref={textareaRef}
                            className="flex-1 px-6 pb-6 pt-2 text-gray-300 bg-transparent focus:outline-none
                                       resize-none leading-relaxed text-sm font-mono custom-scrollbar"
                            placeholder="Start writing... (type / for commands)"
                            value={content}
                            onChange={handleContentChange}
                            onKeyDown={handleTextareaKeyDown}
                            spellCheck={false}
                        />

                        {/* Slash command menu */}
                        {showSlash && filteredSlash.length > 0 && (
                            <div className="absolute left-6 bottom-20 w-56 bg-[#1a1f2e] border border-white/10
                                            rounded-xl shadow-2xl z-50 py-1.5 max-h-64 overflow-y-auto">
                                <p className="px-3 py-1 text-[10px] text-gray-600 uppercase tracking-wider">Commands</p>
                                {filteredSlash.map((cmd, idx) => (
                                    <button key={cmd.cmd}
                                        onClick={() => executeSlashCommand(cmd)}
                                        className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2.5 transition
                                            ${idx === slashIndex ? 'bg-purple-500/20 text-white' : 'text-gray-400 hover:bg-white/5'}`}>
                                        <cmd.icon size={14} className="text-purple-400 shrink-0" />
                                        {cmd.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Preview / Split right */}
                {(mode === 'preview' || mode === 'split') && (
                    <div className={`${mode === 'split' ? 'w-1/2' : 'w-full'} px-6 pb-6 pt-2 overflow-y-auto custom-scrollbar`}>
                        <div className="prose prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
                    </div>
                )}
            </div>

            {/* ── Bottom Status Bar ── */}
            <div className="flex items-center justify-between px-5 py-2 border-t border-white/5 text-[11px] text-gray-600">
                <div className="flex items-center gap-4">
                    <span>{wordCount} words</span>
                    <span>{charCount} chars</span>
                    <span>~{readTime} min read</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {note.updatedAt ? new Date(note.updatedAt).toLocaleString() : ''}
                    </span>
                    <span>Markdown</span>
                </div>
            </div>
        </div>
    );
}

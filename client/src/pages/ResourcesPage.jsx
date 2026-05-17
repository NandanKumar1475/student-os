import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpenText, ExternalLink, Library, Pin, RotateCcw, Tags } from 'lucide-react';
import { jobService } from '../services/jobService';
import { noteService } from '../services/noteService';

const safeArray = (value) => (Array.isArray(value) ? value : []);

const ResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadResources = async () => {
      setLoading(true);
      const [resourceResult, noteResult, tagResult] = await Promise.allSettled([
        jobService.getResources(),
        noteService.getAll(),
        noteService.getTags(),
      ]);

      if (!active) {
        return;
      }

      setResources(resourceResult.status === 'fulfilled' ? safeArray(resourceResult.value.data) : []);
      setNotes(noteResult.status === 'fulfilled' ? safeArray(noteResult.value.data) : []);
      setTags(tagResult.status === 'fulfilled' ? safeArray(tagResult.value.data) : []);
      setLoading(false);
    };

    void loadResources();

    return () => {
      active = false;
    };
  }, []);

  const pinnedNotes = useMemo(() => notes.filter((note) => note.pinned), [notes]);
  const reviewNotes = pinnedNotes.length ? pinnedNotes : notes.slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(167,139,250,0.13),rgba(34,211,238,0.08),rgba(255,255,255,0.04))] p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-100/60">Resources</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
          Your actual study library
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
          Admin resources, pinned notes, and your note tags are shown from live account data.
        </p>
      </div>

      {loading ? (
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 text-center">
          <RotateCcw className="mx-auto h-6 w-6 animate-spin text-cyan-200" />
          <p className="mt-3 text-sm text-slate-400">Loading your library...</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <Library className="h-6 w-6 text-cyan-200" />
              <p className="mt-4 text-3xl font-black text-white">{resources.length}</p>
              <p className="mt-1 text-sm text-slate-400">Admin resources</p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <Pin className="h-6 w-6 text-orange-200" />
              <p className="mt-4 text-3xl font-black text-white">{pinnedNotes.length}</p>
              <p className="mt-1 text-sm text-slate-400">Pinned notes</p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <Tags className="h-6 w-6 text-emerald-200" />
              <p className="mt-4 text-3xl font-black text-white">{tags.length}</p>
              <p className="mt-1 text-sm text-slate-400">Note tags</p>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.78),rgba(8,18,30,0.72))] p-6">
              <div className="flex items-center gap-2">
                <Library className="h-5 w-5 text-cyan-200" />
                <h2 className="text-xl font-bold text-white">Admin resources</h2>
              </div>

              <div className="mt-5 space-y-3">
                {resources.length ? (
                  resources.map((resource) => (
                    <a
                      key={resource.id || resource.externalUrl || resource.title}
                      href={resource.externalUrl || undefined}
                      target={resource.externalUrl ? '_blank' : undefined}
                      rel={resource.externalUrl ? 'noreferrer' : undefined}
                      className="block rounded-2xl border border-white/8 bg-white/5 p-4 transition hover:bg-white/8"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-white">{resource.title || 'Untitled resource'}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {resource.company || resource.source || 'Resource'}
                          </p>
                        </div>
                        {resource.externalUrl && <ExternalLink className="h-4 w-4 shrink-0 text-slate-500" />}
                      </div>
                      {resource.description && (
                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-400">{resource.description}</p>
                      )}
                    </a>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-white/4 p-5">
                    <p className="text-sm font-medium text-white">No admin resources yet</p>
                    <p className="mt-2 text-sm text-slate-400">
                      When an admin posts resources, they will appear here.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.78),rgba(8,18,30,0.72))] p-6">
              <div className="flex items-center gap-2">
                <BookOpenText className="h-5 w-5 text-orange-200" />
                <h2 className="text-xl font-bold text-white">Review notes</h2>
              </div>

              <div className="mt-5 space-y-3">
                {reviewNotes.length ? (
                  reviewNotes.map((note) => (
                    <Link
                      key={note.id}
                      to="/notes"
                      className="block rounded-2xl border border-white/8 bg-white/5 p-4 transition hover:bg-white/8"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-semibold text-white">{note.title || 'Untitled note'}</p>
                        {note.pinned && <Pin className="h-4 w-4 shrink-0 text-orange-200" />}
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
                        {note.preview || note.content || 'No preview available.'}
                      </p>
                    </Link>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-white/4 p-5">
                    <p className="text-sm font-medium text-white">No notes yet</p>
                    <p className="mt-2 text-sm text-slate-400">
                      Create notes and pin important ones to build your resource shelf.
                    </p>
                    <Link to="/notes" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200">
                      Open notes <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-sm text-slate-300">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ResourcesPage;

import { AnimatePresence, motion as Motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import FloatingInput from '../ui/FloatingInput';
import GradientButton from '../ui/GradientButton';

const QuickCaptureModal = ({
  isOpen,
  onClose,
  draft,
  onDraftChange,
  onSubmit,
}) => {
  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <Motion.button
            type="button"
            aria-label="Close quick capture"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm"
          />
          <Motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 top-[12vh] z-50 mx-auto w-full max-w-xl overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/95 shadow-[0_30px_90px_rgba(2,6,23,0.6)] backdrop-blur-2xl"
          >
            <div className="relative overflow-hidden p-6 sm:p-8">
              <div className="absolute inset-x-8 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.35),transparent_70%)] blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#6366f1_0%,#8b5cf6_45%,#3b82f6_100%)] text-white">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Quick capture</p>
                    <h2 className="text-2xl font-semibold text-white">Save a task, note, or target idea</h2>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <FloatingInput
                    label="Title"
                    value={draft.title}
                    onChange={(event) => onDraftChange('title', event.target.value)}
                  />

                  <label className="block">
                    <textarea
                      value={draft.details}
                      onChange={(event) => onDraftChange('details', event.target.value)}
                      placeholder="Add supporting context, links, or next actions"
                      className="min-h-32 w-full rounded-[28px] border border-white/10 bg-white/[0.04] px-4 py-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-300/50 focus:bg-white/[0.08]"
                    />
                  </label>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <GradientButton variant="ghost" onClick={onClose}>
                    Cancel
                  </GradientButton>
                  <GradientButton onClick={onSubmit}>
                    Capture Entry
                  </GradientButton>
                </div>
              </div>
            </div>
          </Motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
};

export default QuickCaptureModal;

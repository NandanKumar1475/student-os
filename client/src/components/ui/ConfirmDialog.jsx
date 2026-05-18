import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

/**
 * Reusable in-app confirmation dialog.
 *
 * Props:
 *   isOpen       – boolean, controls visibility
 *   title        – string, e.g. "Delete Note"
 *   message      – string, e.g. "This action cannot be undone."
 *   confirmLabel – string (default "Delete")
 *   cancelLabel  – string (default "Cancel")
 *   variant      – "danger" | "warning" (default "danger")
 *   onConfirm    – () => void
 *   onCancel     – () => void
 */
export default function ConfirmDialog({
  isOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === 'Escape') onCancel?.();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onCancel]);

  const isDanger = variant === 'danger';

  const modal = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm"
            onClick={onCancel}
            aria-hidden="true"
          />

          {/* Dialog card */}
          <motion.div
            key="dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-message"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[1000] flex items-center justify-center px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="w-full max-w-sm rounded-[28px] border border-white/10
                         bg-[linear-gradient(180deg,rgba(15,22,36,0.98),rgba(10,16,28,0.96))]
                         shadow-[0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Icon */}
              <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl
                ${isDanger
                  ? 'bg-red-500/15 text-red-400'
                  : 'bg-amber-500/15 text-amber-400'}`}
              >
                <AlertTriangle size={26} />
              </div>

              {/* Title */}
              <h2
                id="confirm-dialog-title"
                className="text-center text-lg font-bold text-white"
              >
                {title}
              </h2>

              {/* Message */}
              <p
                id="confirm-dialog-message"
                className="mt-2 text-center text-sm leading-6 text-slate-400"
              >
                {message}
              </p>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                {/* Cancel */}
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 rounded-2xl border border-white/10 bg-white/6
                             py-3 text-sm font-semibold text-slate-300
                             transition hover:bg-white/10 hover:text-white"
                >
                  {cancelLabel}
                </button>

                {/* Confirm */}
                <button
                  type="button"
                  onClick={onConfirm}
                  className={`flex-1 rounded-2xl py-3 text-sm font-semibold transition
                    ${isDanger
                      ? 'bg-red-500 text-white hover:bg-red-600 shadow-[0_6px_20px_rgba(239,68,68,0.35)]'
                      : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-[0_6px_20px_rgba(245,158,11,0.35)]'
                    }`}
                >
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modal, document.body);
}

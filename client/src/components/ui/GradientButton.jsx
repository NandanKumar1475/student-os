import { motion as Motion } from 'framer-motion';

const GradientButton = ({
  children,
  className = '',
  variant = 'primary',
  type = 'button',
  ...props
}) => {
  const baseClassName =
    variant === 'ghost'
      ? 'border border-white/10 bg-white/[0.04] text-slate-100 hover:bg-white/[0.08]'
      : 'bg-[linear-gradient(135deg,#6366f1_0%,#8b5cf6_45%,#3b82f6_100%)] text-white';

  return (
    <Motion.button
      type={type}
      className={`group relative inline-flex items-center justify-center overflow-hidden rounded-2xl px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-indigo-300/60 ${baseClassName} ${className}`}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {variant !== 'ghost' && (
        <span className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.35),transparent_55%)] opacity-0 transition duration-300 group-hover:opacity-100" />
      )}
      {children}
    </Motion.button>
  );
};

export default GradientButton;

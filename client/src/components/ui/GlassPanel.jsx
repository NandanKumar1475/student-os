import { motion as Motion } from 'framer-motion';

const GlassPanel = ({
  children,
  className = '',
  hover = false,
  ...props
}) => {
  if (hover) {
    return (
      <Motion.div
        className={`rounded-[28px] border border-white/10 bg-white/[0.05] shadow-[0_20px_60px_rgba(2,6,23,0.35)] backdrop-blur-2xl ${className}`}
        whileHover={{ y: -6, scale: 1.01 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        {...props}
      >
        {children}
      </Motion.div>
    );
  }

  return (
    <div
      className={`rounded-[28px] border border-white/10 bg-white/[0.05] shadow-[0_20px_60px_rgba(2,6,23,0.35)] backdrop-blur-2xl ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassPanel;

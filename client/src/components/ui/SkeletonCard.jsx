const SkeletonCard = ({ className = '' }) => {
  return (
    <div className={`overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] ${className}`}>
      <div className="animate-pulse space-y-4 p-6">
        <div className="h-4 w-24 rounded-full bg-white/10" />
        <div className="h-10 w-2/3 rounded-2xl bg-white/10" />
        <div className="h-24 rounded-[24px] bg-white/10" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-[72px] rounded-2xl bg-white/10" />
          <div className="h-[72px] rounded-2xl bg-white/10" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;

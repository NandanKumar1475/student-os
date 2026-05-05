const FloatingInput = ({
  label,
  value,
  onChange,
  icon: Icon,
  className = '',
  inputClassName = '',
  type = 'text',
  ...props
}) => {
  const hasValue = Array.isArray(value) ? value.length > 0 : Boolean(value);

  return (
    <label className={`group relative block ${className}`}>
      {Icon ? (
        <Icon className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-500 transition group-focus-within:text-indigo-300" />
      ) : null}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder=" "
        className={`peer w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 pb-3 pt-6 text-sm text-slate-100 outline-none transition placeholder:text-transparent focus:border-indigo-300/50 focus:bg-white/[0.08] ${Icon ? 'pl-11' : ''} ${inputClassName}`}
        {...props}
      />
      <span
        className={`pointer-events-none absolute left-4 top-1/2 origin-left -translate-y-1/2 text-sm text-slate-400 transition duration-200 peer-focus:top-3 peer-focus:translate-y-0 peer-focus:scale-90 peer-focus:text-indigo-200 ${Icon ? 'left-11' : ''} ${hasValue ? 'top-3 translate-y-0 scale-90 text-indigo-100' : ''}`}
      >
        {label}
      </span>
    </label>
  );
};

export default FloatingInput;

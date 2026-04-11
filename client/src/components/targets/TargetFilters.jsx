const TargetFilters = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { label: 'All', value: 'ALL' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Paused', value: 'PAUSED' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onFilterChange(f.value)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition
            ${activeFilter === f.value
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
};

export default TargetFilters;

import { useState, useEffect } from 'react';
import { getAllTargets } from '../api/targetApi';
import TargetCard from '../components/targets/TargetCard';
import CreateTargetModal from '../components/targets/CreateTargetModal';

const TargetsPage = () => {
  const [targets, setTargets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);

  const fetchTargets = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter !== 'ALL' && ['ACTIVE', 'COMPLETED', 'PAUSED'].includes(filter)) {
        params.status = filter;
      }
      const res = await getAllTargets(params);
      setTargets(res.data);
    } catch (err) {
      console.error('Failed to fetch targets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTargets();
  }, [filter]);

  const totalCount = targets.length;
  const activeCount = targets.filter((t) => t.status === 'ACTIVE').length;
  const dueThisWeek = targets.filter((t) => {
    if (!t.deadline) return false;
    const days = Math.ceil((new Date(t.deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return days >= 0 && days <= 7;
  }).length;
  const avgProgress = targets.length > 0
    ? Math.round(targets.reduce((sum, t) => sum + (t.progressPercentage || 0), 0) / targets.length)
    : 0;

  const filters = [
    { label: 'All', value: 'ALL' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Paused', value: 'PAUSED' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Your Targets 🎯</h1>
          <p className="text-gray-500 text-sm mt-1">Set goals and track your progress</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-[#1e1e35] rounded-xl border border-[#2a2a45]">
            <span className="text-gray-400 text-sm">Focus Mode</span>
            <div className="w-10 h-5 bg-[#2a2a45] rounded-full relative cursor-pointer">
              <div className="w-4 h-4 bg-gray-500 rounded-full absolute top-0.5 left-0.5"></div>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
          >
            + Create Target
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1e1e35] rounded-2xl p-5 border border-[#2a2a45]">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-400">◎</span>
            <span className="text-gray-500 text-sm">Total Targets</span>
          </div>
          <p className="text-white text-3xl font-extrabold">{totalCount}</p>
        </div>
        <div className="bg-[#1e1e35] rounded-2xl p-5 border border-[#2a2a45]">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-400">📈</span>
            <span className="text-gray-500 text-sm">In Progress</span>
          </div>
          <p className="text-white text-3xl font-extrabold">{activeCount}</p>
        </div>
        <div className="bg-[#1e1e35] rounded-2xl p-5 border border-[#2a2a45]">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-orange-400">📅</span>
            <span className="text-gray-500 text-sm">Due This Week</span>
          </div>
          <p className="text-white text-3xl font-extrabold">{dueThisWeek}</p>
        </div>
        <div className="bg-[#1e1e35] rounded-2xl p-5 border border-[#2a2a45]">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-yellow-400">⭐</span>
            <span className="text-gray-500 text-sm">Avg Progress</span>
          </div>
          <p className="text-white text-3xl font-extrabold">{avgProgress}%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition
              ${filter === f.value
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'bg-[#1e1e35] text-gray-400 hover:text-white hover:bg-[#252545] border border-[#2a2a45]'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Target Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : targets.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🎯</p>
          <h3 className="text-xl font-bold text-gray-300 mb-2">No targets yet</h3>
          <p className="text-gray-600 mb-6">Create your first target to start tracking your prep!</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            + Create Target
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {targets.map((target) => (
            <TargetCard key={target.id} target={target} onRefresh={fetchTargets} />
          ))}
        </div>
      )}

      <CreateTargetModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreated={fetchTargets}
      />
    </div>
  );
};

export default TargetsPage;
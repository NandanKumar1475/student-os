import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/authApi';
import { useAuth } from "../../hooks/useAuth";
import toast from 'react-hot-toast';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Radar,
  Trophy,
  BrainCircuit,
  Orbit,
} from 'lucide-react';
import { motion } from "framer-motion";

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const featureCards = [
    {
      icon: Radar,
      title: 'Daily direction',
      text: 'Your schedule, targets, and deadlines aligned in one intelligent flow.',
    },
    {
      icon: BrainCircuit,
      title: 'Skill pulse',
      text: 'Weak spots, momentum, and learning depth surfaced before they become problems.',
    },
    {
      icon: Trophy,
      title: 'Placement engine',
      text: 'Turn practice, consistency, and readiness into a real interview advantage.',
    },
  ];

  const storyPills = [
    'Track',
    'Focus',
    'Practice',
    'Improve',
    'Get placed',
  ];

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(form);
      login(res.data.token, res.data.user);
      toast.success('Welcome back 🚀');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07111f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(73,195,255,0.2),_transparent_35%),radial-gradient(circle_at_80%_20%,_rgba(255,170,92,0.16),_transparent_22%),linear-gradient(135deg,_#04111f_0%,_#071b2d_45%,_#02060d_100%)]" />
      <div className="absolute inset-0 opacity-50 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />
      <div className="absolute inset-y-0 left-[10%] w-56 rotate-12 bg-[linear-gradient(180deg,transparent,rgba(121,224,255,0.2),transparent)] blur-3xl animate-aurora" />
      <div className="absolute inset-y-0 right-[12%] w-48 -rotate-12 bg-[linear-gradient(180deg,transparent,rgba(255,162,97,0.24),transparent)] blur-3xl animate-aurora-delayed" />
      <div className="absolute left-[8%] top-[18%] h-64 w-64 rounded-full border border-cyan-300/15 animate-orbit-slow" />
      <div className="absolute left-[11%] top-[21%] h-40 w-40 rounded-full border border-cyan-200/10 animate-orbit-reverse" />
      <div className="absolute right-[10%] bottom-[12%] h-72 w-72 rounded-full border border-orange-200/10 animate-orbit-slow" />

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        <div className="flex w-full items-center px-6 py-14 sm:px-10 lg:w-[58%] lg:px-14 xl:px-20">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="w-full max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-white/8 px-4 py-2 text-sm text-cyan-100 backdrop-blur-md">
              <Sparkles size={16} className="text-cyan-200" />
              Student OS is not just a tracker. It behaves like a personal command center.
            </div>

            <div className="mt-8 max-w-2xl">
              <p className="text-sm uppercase tracking-[0.45em] text-cyan-200/70">
                Build momentum with intent
              </p>
              <h1 className="mt-4 text-5xl font-black leading-[0.95] text-white sm:text-6xl xl:text-7xl">
                Your future,
                <span className="block bg-[linear-gradient(90deg,#82e7ff_0%,#ffd29f_45%,#f9ffff_100%)] bg-clip-text text-transparent">
                  rendered live.
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                A login screen that feels like the product itself: living signals,
                rising streaks, exam focus, and placement readiness moving around you.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {storyPills.map((pill, index) => (
                <motion.div
                  key={pill}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (index * 0.08) }}
                  className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-slate-200 backdrop-blur-md"
                >
                  {pill}
                </motion.div>
              ))}
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {featureCards.map(({ icon: Icon, title, text }, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + (index * 0.1), duration: 0.6 }}
                  className="group rounded-[28px] border border-white/10 bg-white/8 p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-200/30 hover:bg-white/12"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(129,232,255,0.25),rgba(255,189,122,0.2))] text-cyan-100">
                    <Icon size={20} />
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-white">{title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 hidden lg:block">
              <div className="relative h-[320px] overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.1),rgba(255,255,255,0.03))] p-6 backdrop-blur-2xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(130,231,255,0.22),transparent_28%),radial-gradient(circle_at_80%_30%,rgba(255,194,132,0.18),transparent_20%)]" />
                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-cyan-100/60">Live system story</p>
                      <p className="mt-2 text-2xl font-semibold text-white">Everything important, moving together</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
                      <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
                      System active
                    </div>
                  </div>

                  <div className="grid grid-cols-[1.3fr_0.9fr] gap-4">
                    <div className="rounded-[24px] border border-white/10 bg-slate-950/35 p-5">
                      <div className="flex items-center justify-between text-sm text-slate-300">
                        <span>Placement readiness</span>
                        <span className="text-cyan-200">82%</span>
                      </div>
                      <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/8">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '82%' }}
                          transition={{ duration: 1.4, ease: 'easeOut' }}
                          className="h-full rounded-full bg-[linear-gradient(90deg,#78e4ff,#ffbf7d)]"
                        />
                      </div>
                      <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                        <div className="rounded-2xl bg-white/6 p-3">
                          <p className="text-2xl font-bold text-white">14</p>
                          <p className="mt-1 text-xs text-slate-400">focus hrs</p>
                        </div>
                        <div className="rounded-2xl bg-white/6 p-3">
                          <p className="text-2xl font-bold text-white">9</p>
                          <p className="mt-1 text-xs text-slate-400">mock tests</p>
                        </div>
                        <div className="rounded-2xl bg-white/6 p-3">
                          <p className="text-2xl font-bold text-white">27</p>
                          <p className="mt-1 text-xs text-slate-400">day streak</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                        className="rounded-[24px] border border-cyan-200/15 bg-cyan-300/10 p-4 text-cyan-50 backdrop-blur-md"
                      >
                        <div className="flex items-center gap-3">
                          <Orbit size={18} />
                          <p className="text-sm font-medium">Career map syncing</p>
                        </div>
                        <p className="mt-2 text-sm text-cyan-50/75">
                          Tasks, targets, and skills are speaking to each other now.
                        </p>
                      </motion.div>

                      <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                        className="ml-8 rounded-[24px] border border-orange-200/15 bg-orange-300/10 p-4 text-orange-50 backdrop-blur-md"
                      >
                        <div className="flex items-center gap-3">
                          <Sparkles size={18} />
                          <p className="text-sm font-medium">Momentum detected</p>
                        </div>
                        <p className="mt-2 text-sm text-orange-50/75">
                          One more focused week could push your readiness into interview range.
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex w-full items-center justify-center px-6 pb-14 sm:px-10 lg:w-[42%] lg:px-14 lg:pb-0">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-white/12 bg-[linear-gradient(180deg,rgba(8,20,34,0.88),rgba(8,18,31,0.68))] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
          >
            <div className="absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(130,231,255,0.8),transparent)]" />
            <div className="absolute -right-16 top-8 h-32 w-32 rounded-full bg-cyan-300/10 blur-3xl" />
            <div className="absolute -left-10 bottom-10 h-28 w-28 rounded-full bg-orange-300/10 blur-3xl" />

            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#7be2ff,#ffbd7d)] text-slate-950 shadow-[0_10px_30px_rgba(123,226,255,0.28)]">
                  <ArrowRight size={20} />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-cyan-100/55">Student OS</p>
                  <h2 className="mt-1 text-3xl font-bold text-white">Enter the system</h2>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-300">
                Pick up where your focus left off. Your goals, streaks, and next moves are waiting.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-white/10 bg-white/6 py-3.5 pl-11 pr-4 text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-300/40 focus:bg-white/10"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    placeholder="Password"
                    className="w-full rounded-2xl border border-white/10 bg-white/6 py-3.5 pl-11 pr-11 text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-300/40 focus:bg-white/10"
                  />

                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(90deg,#79e0ff,#ffbf7d)] px-4 py-3.5 font-semibold text-slate-950 transition duration-200 hover:scale-[1.01] hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? 'Logging in...' : 'Launch my dashboard'}
                  {!loading && <ArrowRight size={18} className="transition group-hover:translate-x-0.5" />}
                </button>
              </form>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/6 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">Today inside Student OS</span>
                  <span className="text-cyan-200">Focus synced</span>
                </div>
                <div className="mt-3 flex items-end gap-2">
                  {[35, 52, 44, 68, 80, 62, 91].map((height, index) => (
                    <motion.div
                      key={height}
                      initial={{ height: 8 }}
                      animate={{ height }}
                      transition={{ delay: 0.15 * index, duration: 0.7 }}
                      className="w-full rounded-full bg-[linear-gradient(180deg,rgba(121,224,255,0.95),rgba(255,191,125,0.55))]"
                    />
                  ))}
                </div>
              </div>

              <p className="mt-6 text-center text-sm text-slate-400">
                Don&apos;t have an account?{' '}
                <Link to="/register" className="font-semibold text-cyan-200 transition hover:text-white">
                  Create one
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

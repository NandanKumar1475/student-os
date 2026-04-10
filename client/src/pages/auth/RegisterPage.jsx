import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../api/authApi';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { ArrowRight, GraduationCap, Mail, Lock, User2, Sparkles } from 'lucide-react';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await registerUser(form);
      login(res.data.token, res.data.user);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07111f] px-4 py-10 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(81,204,255,0.18),transparent_28%),radial-gradient(circle_at_85%_18%,rgba(255,182,120,0.16),transparent_20%),linear-gradient(135deg,#05111e_0%,#0a1627_48%,#03070f_100%)]" />
      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(121,224,255,0.14),rgba(255,190,125,0.08),rgba(255,255,255,0.04))] p-8 backdrop-blur-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-white/8 px-4 py-2 text-sm text-cyan-100">
            <Sparkles size={16} className="text-cyan-200" />
            Start your Student OS system
          </div>
          <h1 className="mt-6 text-5xl font-black tracking-tight text-white">Create an account that feels like a launchpad.</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
            Set up once, then let your targets, tasks, and placement prep stay organized in one calm premium workspace.
          </p>
          <div className="mt-8 rounded-[28px] border border-white/10 bg-slate-950/25 p-5">
            <div className="flex items-center gap-3 text-orange-200">
              <GraduationCap size={18} />
              <span className="font-medium">Built for students who want clarity, not clutter.</span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md justify-self-center rounded-[32px] border border-white/12 bg-[linear-gradient(180deg,rgba(8,20,34,0.88),rgba(8,18,31,0.68))] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-100/55">Register</p>
            <h2 className="mt-2 text-3xl font-bold text-white">Create your space</h2>
            <p className="mt-2 text-sm text-slate-400">Join and start tracking with a cleaner premium UI.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <User2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" name="name" value={form.name} onChange={handleChange} required
                className="w-full rounded-2xl border border-white/10 bg-white/6 py-3.5 pl-11 pr-4 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/35 focus:bg-white/10"
                placeholder="Full name" />
            </div>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="email" name="email" value={form.email} onChange={handleChange} required
                className="w-full rounded-2xl border border-white/10 bg-white/6 py-3.5 pl-11 pr-4 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/35 focus:bg-white/10"
                placeholder="you@example.com" />
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={6}
                className="w-full rounded-2xl border border-white/10 bg-white/6 py-3.5 pl-11 pr-4 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/35 focus:bg-white/10"
                placeholder="Minimum 6 characters" />
            </div>
            <button type="submit" disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(90deg,#79e0ff,#ffbf7d)] py-3.5 font-semibold text-slate-950 transition hover:brightness-105 disabled:opacity-50">
              {loading ? 'Creating account...' : 'Create account'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="text-center mt-6 text-slate-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-200 font-semibold hover:text-white">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

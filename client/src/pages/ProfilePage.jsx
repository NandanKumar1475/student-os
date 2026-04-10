import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { updateProfile } from '../api/authApi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, GraduationCap, Save, Sparkles, UserCircle2 } from 'lucide-react';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || '',
    college: user?.college || '',
    branch: user?.branch || '',
    year: user?.year || '',
    careerGoal: user?.careerGoal || '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateProfile({
        ...form,
        year: form.year ? parseInt(form.year) : null,
      });
      setUser(res.data.data);
      toast.success('Profile updated!');
      navigate('/');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/35 focus:bg-white/10";

  return (
    <div className="mx-auto grid max-w-6xl gap-6 xl:grid-cols-[0.85fr_1.15fr]">
      <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(121,224,255,0.14),rgba(255,190,125,0.08),rgba(255,255,255,0.04))] p-8 backdrop-blur-xl">
        <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-[linear-gradient(135deg,#7be2ff,#ffbd7d)] text-slate-950">
          <UserCircle2 size={30} />
        </div>
        <p className="mt-6 text-xs uppercase tracking-[0.35em] text-cyan-100/55">Profile settings</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-white">Make your workspace feel personal.</h1>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          Keep your student details, career direction, and learning identity up to date so the app can feel more useful and more tailored.
        </p>

        <div className="mt-8 space-y-3">
          <div className="rounded-2xl border border-white/10 bg-slate-950/25 p-4">
            <div className="flex items-center gap-2 text-cyan-200">
              <GraduationCap size={16} />
              <span className="text-sm font-medium">Academic context</span>
            </div>
            <p className="mt-2 text-sm text-slate-400">College, branch, and year help shape your planning view.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/25 p-4">
            <div className="flex items-center gap-2 text-orange-200">
              <Sparkles size={16} />
              <span className="text-sm font-medium">Career direction</span>
            </div>
            <p className="mt-2 text-sm text-slate-400">A clear goal makes targets and skill tracking easier to understand.</p>
          </div>
        </div>
      </div>

      <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,20,34,0.92),rgba(7,17,29,0.76))] p-8 backdrop-blur-xl">
        <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">College</label>
            <input type="text" name="college" value={form.college} onChange={handleChange}
              className={inputClass} placeholder="e.g. VTU, IIT Delhi" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Branch</label>
              <input type="text" name="branch" value={form.branch} onChange={handleChange}
                className={inputClass} placeholder="e.g. CSE" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Year</label>
              <select name="year" value={form.year} onChange={handleChange} className={inputClass}>
                <option value="">Select</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Career Goal</label>
            <select name="careerGoal" value={form.careerGoal} onChange={handleChange} className={inputClass}>
              <option value="">Select your goal</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
              <option value="Mobile Developer">Mobile Developer</option>
              <option value="AI/ML Engineer">AI/ML Engineer</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(90deg,#79e0ff,#ffbf7d)] py-3 font-semibold text-slate-950 transition hover:brightness-105 disabled:opacity-50">
              <Save size={16} />
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
            <button type="button" onClick={() => navigate('/')}
              className="flex items-center gap-2 px-6 py-3 bg-white/6 text-slate-300 rounded-2xl font-semibold hover:bg-white/10 hover:text-white transition border border-white/10">
              <ArrowLeft size={16} />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { updateProfile } from '../api/authApi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

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

  const inputClass = "w-full bg-[#1e1e35] text-gray-200 px-4 py-3 rounded-xl border border-[#2a2a45] focus:border-blue-500 focus:outline-none transition placeholder-gray-600 text-sm";

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-[#151525] rounded-2xl p-8 border border-[#2a2a45]">
        <h1 className="text-2xl font-bold text-white mb-6">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">College</label>
            <input type="text" name="college" value={form.college} onChange={handleChange}
              className={inputClass} placeholder="e.g. VTU, IIT Delhi" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Branch</label>
              <input type="text" name="branch" value={form.branch} onChange={handleChange}
                className={inputClass} placeholder="e.g. CSE" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Year</label>
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
            <label className="block text-sm font-medium text-gray-400 mb-1">Career Goal</label>
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
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 shadow-lg shadow-blue-600/20">
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
            <button type="button" onClick={() => navigate('/')}
              className="px-6 py-3 bg-[#1e1e35] text-gray-400 rounded-xl font-semibold hover:bg-[#252545] hover:text-white transition border border-[#2a2a45]">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
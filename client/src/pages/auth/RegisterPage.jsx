import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../api/authApi';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

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
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f1a]">
      <div className="w-full max-w-md bg-[#151525] rounded-2xl shadow-2xl p-8 mx-4 border border-[#2a2a45]">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">
            <span className="text-blue-400">Student</span>{' '}
            <span className="text-white">OS</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2">Create your account and start tracking</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required
              className="w-full bg-[#1e1e35] text-gray-200 px-4 py-3 rounded-xl border border-[#2a2a45] focus:border-blue-500 focus:outline-none transition placeholder-gray-600 text-sm"
              placeholder="Nandan Kumar" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required
              className="w-full bg-[#1e1e35] text-gray-200 px-4 py-3 rounded-xl border border-[#2a2a45] focus:border-blue-500 focus:outline-none transition placeholder-gray-600 text-sm"
              placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={6}
              className="w-full bg-[#1e1e35] text-gray-200 px-4 py-3 rounded-xl border border-[#2a2a45] focus:border-blue-500 focus:outline-none transition placeholder-gray-600 text-sm"
              placeholder="Minimum 6 characters" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 shadow-lg shadow-blue-600/20">
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
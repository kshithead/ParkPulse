import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Car, Lock, Mail, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('portal') === 'admin' ? 'admin' : 'user';

  const [activePortal, setActivePortal] = useState(initialRole); // 'user' | 'admin'
  const [email, setEmail] = useState(initialRole === 'admin' ? 'admin@parkpulse.edu' : 'alex@campus.edu');
  const [password, setPassword] = useState(initialRole === 'admin' ? 'admin123' : 'password123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handlePortalSwitch = (portal) => {
    setActivePortal(portal);
    setError('');
    if (portal === 'admin') {
      setEmail('admin@parkpulse.edu');
      setPassword('admin123');
    } else {
      setEmail('alex@campus.edu');
      setPassword('password123');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your authorized email or ID.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = login(email, password, activePortal);
      setIsLoading(false);
      if (res.success) {
        if (activePortal === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError('Invalid credentials for this portal. Please check and retry.');
      }
    }, 250);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Brand */}
        <Link to="/" className="flex items-center justify-center gap-3 mb-6 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-xl shadow-emerald-500/25 group-hover:scale-105 transition-transform">
            <Car className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Park<span className="text-emerald-400">Pulse</span>
            </h2>
            <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Smart Parking Management
            </p>
          </div>
        </Link>

        {/* Card */}
        <div className="bg-slate-900/90 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-800">
          {/* Portal Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-slate-950 rounded-2xl border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => handlePortalSwitch('user')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activePortal === 'user'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Driver Portal</span>
            </button>

            <button
              type="button"
              onClick={() => handlePortalSwitch('admin')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activePortal === 'admin'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Security Officer</span>
            </button>
          </div>

          <div className="mb-6 text-center">
            <h3 className="text-lg font-bold text-white">
              {activePortal === 'admin'
                ? 'Security & Operations Sign-In'
                : 'Student & Faculty Driver Sign-In'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {activePortal === 'admin'
                ? 'Access the Central Parking Control & Enforcement Console'
                : 'Manage your vehicle sessions, view free slots, and check in'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email / Officer ID */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  {activePortal === 'admin' ? 'Officer Email / ID' : 'Campus Email'}
                </label>
                <span className="text-[10px] text-slate-500 font-mono">
                  {activePortal === 'admin' ? 'admin@parkpulse.edu' : 'alex@campus.edu'}
                </span>
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={activePortal === 'admin' ? 'officer@campus.edu' : 'student@campus.edu'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
                <span className="text-[10px] text-slate-500 font-mono">
                  {activePortal === 'admin' ? 'admin123' : 'password123'}
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-xl font-bold text-xs shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
                activePortal === 'admin'
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/25'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
              }`}
            >
              <span>{isLoading ? 'Authenticating...' : `Enter ${activePortal === 'admin' ? 'Admin Console' : 'Driver Portal'}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {activePortal === 'user' && (
            <div className="mt-6 text-center text-xs text-slate-400">
              New driver on campus?{' '}
              <Link to="/register" className="text-emerald-400 hover:underline font-semibold">
                Register Your Vehicle
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

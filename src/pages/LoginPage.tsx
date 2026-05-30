import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setError('');
    setLoading(true);
    const { error: err } = await login(email, password);
    setLoading(false);
    if (err) setError(err);
    else navigate('/dashboard');
  };

  return (
    <div className="min-h-screen dark:bg-slate-950 bg-slate-50 flex">
      {/* Left branding */}
      <div className="hidden lg:flex lg:w-5/12 relative p-12 flex-col justify-between overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #0f172a 100%)' }}>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, #60a5fa 0%, transparent 50%), radial-gradient(circle at 80% 20%, #a78bfa 0%, transparent 50%)' }} />
        <div className="relative">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Building2 size={20} className="text-white" />
            </div>
            <span className="font-display text-xl font-bold text-white">CorpHRMS</span>
          </div>
          <h2 className="font-display text-4xl font-bold text-white leading-tight mb-4">
            Manage your workforce<br />with confidence
          </h2>
          <p className="text-blue-200 text-sm leading-relaxed max-w-xs">
            A complete HR management system for modern enterprises.
          </p>
        </div>
        <div className="relative grid grid-cols-2 gap-3">
          {[{ label: 'Employees', value: '1,200+' }, { label: 'Departments', value: '24' },
            { label: 'Active Today', value: '847' }, { label: 'Open Positions', value: '36' }]
            .map(({ label, value }) => (
            <div key={label} className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="font-display text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-blue-200 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>
              <Building2 size={16} className="text-white" />
            </div>
            <span className="font-display text-lg font-bold dark:text-slate-100 text-slate-900">CorpHRMS</span>
          </div>
          <h1 className="font-display text-2xl font-bold dark:text-slate-100 text-slate-900 mb-1">Welcome back</h1>
          <p className="text-sm dark:text-slate-500 text-slate-500 mb-8">Sign in to your admin account</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@corp.io" autoFocus />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0">Password</label>
                <Link to="/forgot-password" className="text-xs transition-colors" style={{ color: 'var(--color-primary)' }}>
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} className="input pr-10"
                  value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 dark:text-slate-500 text-slate-400 transition-colors">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            {error && (
              <div className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">{error}</div>
            )}
            <button type="submit" className="btn-primary w-full justify-center py-2.5 mt-2" disabled={loading}>
              {loading ? <Loader2 size={15} className="animate-spin" /> : null}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm dark:text-slate-500 text-slate-500">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium transition-colors" style={{ color: 'var(--color-primary)' }}>
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
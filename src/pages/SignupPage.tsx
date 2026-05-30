import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8+ chars',  ok: password.length >= 8 },
    { label: 'Uppercase', ok: /[A-Z]/.test(password) },
    { label: 'Number',    ok: /\d/.test(password) },
  ];
  if (!password) return null;
  return (
    <div className="flex gap-2 mt-1.5">
      {checks.map(c => (
        <span key={c.label} className={`text-xs flex items-center gap-0.5 ${c.ok ? 'text-emerald-400' : 'dark:text-slate-600 text-slate-400'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${c.ok ? 'bg-emerald-400' : 'dark:bg-slate-700 bg-slate-300'}`} />
          {c.label}
        </span>
      ))}
    </div>
  );
}

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate   = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [confirm,   setConfirm]   = useState('');
  const [showPass,  setShowPass]  = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [success,   setSuccess]   = useState(false);

  const validate = () => {
    if (!firstName.trim() || !lastName.trim()) return 'First and last name are required.';
    if (!email.includes('@'))                   return 'Enter a valid email address.';
    if (password.length < 8)                    return 'Password must be at least 8 characters.';
    if (password !== confirm)                   return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setLoading(true);
    const { error: apiErr } = await signup(email, password, firstName.trim(), lastName.trim());
    setLoading(false);
    if (apiErr) { setError(apiErr); return; }
    setSuccess(true);
    setTimeout(() => navigate('/login'), 3000);
  };

  return (
    <div className="min-h-screen dark:bg-slate-950 bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>
            <Building2 size={18} className="text-white" />
          </div>
          <span className="font-display text-lg font-bold dark:text-slate-100 text-slate-900">CorpHRMS</span>
        </div>
        <div className="card">
          <h1 className="font-display text-xl font-bold dark:text-slate-100 text-slate-900 mb-1">Create account</h1>
          <p className="text-sm dark:text-slate-500 text-slate-500 mb-6">Join your organization's HRMS portal</p>
          {success ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <CheckCircle2 size={40} className="text-emerald-400" />
              <p className="font-display font-semibold dark:text-slate-100 text-slate-900">Account created!</p>
              <p className="text-sm dark:text-slate-400 text-slate-500">Check your email to confirm. Redirecting…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">First Name</label>
                  <input className="input" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Arjun" autoFocus />
                </div>
                <div>
                  <label className="label">Last Name</label>
                  <input className="input" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Mehta" />
                </div>
              </div>
              <div>
                <label className="label">Email Address</label>
                <input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@corp.io" />
              </div>
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} className="input pr-10"
                    value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 dark:text-slate-500 text-slate-400 transition-colors">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <PasswordStrength password={password} />
              </div>
              <div>
                <label className="label">Confirm Password</label>
                <input type="password" className="input" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" />
                {confirm && confirm !== password && <p className="mt-1 text-xs text-red-400">Passwords do not match</p>}
              </div>
              {error && <div className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">{error}</div>}
              <button type="submit" className="btn-primary w-full justify-center py-2.5" disabled={loading}>
                {loading ? <Loader2 size={15} className="animate-spin" /> : null}
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>
          )}
        </div>
        <p className="mt-5 text-center text-sm dark:text-slate-500 text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium transition-colors" style={{ color: 'var(--color-primary)' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
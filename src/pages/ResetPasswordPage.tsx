import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ResetPasswordPage() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [done,     setDone]     = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setError('');
    setLoading(true);
    const { error: err } = await updatePassword(password);
    setLoading(false);
    if (err) { setError(err); return; }
    setDone(true);
    setTimeout(() => navigate('/login'), 2500);
  };

  return (
    <div className="min-h-screen dark:bg-slate-950 bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>
            <Building2 size={18} className="text-white" />
          </div>
          <span className="font-display text-lg font-bold dark:text-slate-100 text-slate-900">CorpHRMS</span>
        </div>
        <div className="card">
          {done ? (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 size={28} className="text-emerald-400" />
              </div>
              <p className="font-display font-bold dark:text-slate-100 text-slate-900 text-lg">Password updated!</p>
              <p className="text-sm dark:text-slate-400 text-slate-500">Redirecting to login…</p>
            </div>
          ) : (
            <>
              <h1 className="font-display text-xl font-bold dark:text-slate-100 text-slate-900 mb-1">Set new password</h1>
              <p className="text-sm dark:text-slate-500 text-slate-500 mb-6">Choose a strong password.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">New Password</label>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} className="input pr-10"
                      value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoFocus />
                    <button type="button" onClick={() => setShowPass(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 dark:text-slate-500 text-slate-400 transition-colors">
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="label">Confirm Password</label>
                  <input type="password" className="input" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" />
                </div>
                {error && <div className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">{error}</div>}
                <button type="submit" className="btn-primary w-full justify-center py-2.5" disabled={loading}>
                  {loading ? <Loader2 size={15} className="animate-spin" /> : null}
                  {loading ? 'Updating…' : 'Update Password'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Loader2, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [sent,    setSent]    = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) { setError('Enter a valid email address.'); return; }
    setError('');
    setLoading(true);
    const { error: err } = await resetPassword(email);
    setLoading(false);
    if (err) setError(err);
    else setSent(true);
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
          {sent ? (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 size={28} className="text-emerald-400" />
              </div>
              <div>
                <p className="font-display font-bold dark:text-slate-100 text-slate-900 text-lg mb-1">Check your inbox</p>
                <p className="text-sm dark:text-slate-400 text-slate-500 leading-relaxed">
                  Reset link sent to <span className="font-medium dark:text-slate-200 text-slate-700">{email}</span>
                </p>
              </div>
              <Link to="/login" className="btn-primary mt-2">
                <ArrowLeft size={15} /> Back to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                <Mail size={22} className="text-blue-400" />
              </div>
              <h1 className="font-display text-xl font-bold dark:text-slate-100 text-slate-900 mb-1">Forgot password?</h1>
              <p className="text-sm dark:text-slate-500 text-slate-500 mb-6">Enter your email and we'll send a reset link.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Email Address</label>
                  <input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@corp.io" autoFocus />
                </div>
                {error && <div className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">{error}</div>}
                <button type="submit" className="btn-primary w-full justify-center py-2.5" disabled={loading}>
                  {loading ? <Loader2 size={15} className="animate-spin" /> : null}
                  {loading ? 'Sending…' : 'Send Reset Link'}
                </button>
              </form>
            </>
          )}
        </div>
        <p className="mt-5 text-center">
          <Link to="/login" className="text-sm font-medium inline-flex items-center gap-1 transition-colors"
            style={{ color: 'var(--color-primary)' }}>
            <ArrowLeft size={13} /> Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
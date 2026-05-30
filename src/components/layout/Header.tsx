import { useState, useRef, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Menu, Sun, Moon, Monitor, LogOut, ChevronDown } from 'lucide-react';
import { useAuth }  from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Avatar }   from '../ui/Avatar';

interface HeaderProps { title: string; subtitle?: string; }
interface OutletCtx  { setSidebarOpen: (v: boolean) => void; }

export function Header({ title, subtitle }: HeaderProps) {
  const { user, logout }           = useAuth();
  const { mode, setMode }          = useTheme();
  const navigate                   = useNavigate();
  const ctx = useOutletContext<OutletCtx | null>();

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const cycleTheme = () => {
    const order: typeof mode[] = ['light', 'dark', 'system'];
    setMode(order[(order.indexOf(mode) + 1) % order.length]);
  };

  const ThemeIcon = mode === 'light' ? Sun : mode === 'dark' ? Moon : Monitor;

  const handleLogout = async () => { setProfileOpen(false); await logout(); navigate('/login'); };

  return (
    <header className="h-14 sm:h-16 flex items-center justify-between px-4 sm:px-6
                       dark:border-slate-700/50 border-slate-200 border-b
                       dark:bg-slate-950/90 bg-white/90 backdrop-blur-sm sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button className="lg:hidden p-2 rounded-lg dark:hover:bg-slate-700/60 hover:bg-slate-100 dark:text-slate-400 text-slate-600 transition-colors"
          onClick={() => ctx?.setSidebarOpen(true)}>
          <Menu size={18} />
        </button>
        <div>
          <h1 className="font-display text-base font-bold dark:text-slate-100 text-slate-900 leading-tight">{title}</h1>
          {subtitle && <p className="text-xs dark:text-slate-500 text-slate-500 mt-0.5 hidden sm:block">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button onClick={cycleTheme} title={`Theme: ${mode}`}
          className="p-2 rounded-lg dark:hover:bg-slate-700/60 hover:bg-slate-100 dark:text-slate-400 text-slate-600 transition-colors">
          <ThemeIcon size={16} />
        </button>

        {user && (
          <div className="relative" ref={profileRef}>
            <button onClick={() => setProfileOpen(v => !v)}
              className="flex items-center gap-2 pl-2 pr-1 py-1.5 rounded-lg dark:hover:bg-slate-700/60 hover:bg-slate-100 transition-colors">
              <Avatar name={user.name} size="sm" />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold dark:text-slate-200 text-slate-800 leading-tight">{user.name}</p>
                <p className="text-xs dark:text-slate-500 text-slate-500">{user.role}</p>
              </div>
              <ChevronDown size={13} className={`dark:text-slate-500 text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-52 rounded-xl shadow-xl z-50
                              dark:bg-slate-800 bg-white dark:border-slate-700/50 border-slate-200 border overflow-hidden"
                style={{ animation: 'scaleIn 0.15s ease-out' }}>
                <div className="px-4 py-3 dark:border-slate-700/50 border-slate-100 border-b">
                  <p className="text-sm font-semibold dark:text-slate-100 text-slate-900 truncate">{user.name}</p>
                  <p className="text-xs dark:text-slate-500 text-slate-500 truncate">{user.email}</p>
                </div>
                <div className="p-1.5">
                  <div className="flex items-center gap-1 p-1.5 mb-1">
                    <p className="text-xs dark:text-slate-500 text-slate-500 mr-1">Theme:</p>
                    {(['light','dark','system'] as const).map(t => {
                      const Icon = t === 'light' ? Sun : t === 'dark' ? Moon : Monitor;
                      return (
                        <button key={t} onClick={() => setMode(t)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            mode === t ? 'text-white' : 'dark:text-slate-400 text-slate-600 dark:hover:bg-slate-700 hover:bg-slate-100'
                          }`}
                          style={mode === t ? { backgroundColor: 'var(--color-primary)' } : {}}>
                          <Icon size={13} />
                        </button>
                      );
                    })}
                  </div>
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-500 dark:hover:bg-red-500/10 hover:bg-red-50 transition-colors">
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
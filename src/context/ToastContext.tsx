import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';
interface Toast { id: string; type: ToastType; title: string; message?: string; }

interface ToastContextType {
  toast: (type: ToastType, title: string, message?: string) => void;
  success: (title: string, message?: string) => void;
  error:   (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info:    (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

const ICONS = { success: CheckCircle2, error: XCircle, warning: AlertTriangle, info: Info };
const ICON_COLOR: Record<ToastType, string> = {
  success: 'text-emerald-400', error: 'text-red-400', warning: 'text-amber-400', info: 'text-blue-400',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) =>
    setToasts(prev => prev.filter(t => t.id !== id)), []);

  const toast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => dismiss(id), 4500);
  }, [dismiss]);

  const success = useCallback((t: string, m?: string) => toast('success', t, m), [toast]);
  const error   = useCallback((t: string, m?: string) => toast('error',   t, m), [toast]);
  const warning = useCallback((t: string, m?: string) => toast('warning', t, m), [toast]);
  const info    = useCallback((t: string, m?: string) => toast('info',    t, m), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2.5 w-80 pointer-events-none">
        {toasts.map(t => {
          const Icon = ICONS[t.type];
          return (
            <div key={t.id}
              className="flex items-start gap-3 p-4 rounded-xl shadow-xl pointer-events-auto border backdrop-blur-xl
                         dark:bg-slate-800/95 dark:border-slate-700/60 bg-white/95 border-slate-200"
              style={{ animation: 'slideInRight 0.25s ease-out' }}>
              <Icon size={17} className={`shrink-0 mt-0.5 ${ICON_COLOR[t.type]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold dark:text-slate-100 text-slate-800 leading-snug">{t.title}</p>
                {t.message && <p className="text-xs dark:text-slate-400 text-slate-500 mt-0.5">{t.message}</p>}
              </div>
              <button onClick={() => dismiss(t.id)}
                className="p-1 rounded-md dark:hover:bg-slate-700 hover:bg-slate-100 dark:text-slate-500 text-slate-400 transition-colors shrink-0">
                <X size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
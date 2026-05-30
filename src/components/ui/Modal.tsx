import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps { open: boolean; onClose: () => void; title: string; children: ReactNode; width?: string; }

export function Modal({ open, onClose, title, children, width = 'max-w-lg' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 dark:bg-slate-950/80 bg-black/40 backdrop-blur-sm" />
      <div
        className={`relative w-full ${width} dark:bg-slate-800 bg-white
          dark:border-slate-700/50 border-slate-200 border rounded-2xl shadow-2xl overflow-hidden`}
        style={{ animation: 'scaleIn 0.18s ease-out' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 dark:border-slate-700/50 border-slate-200 border-b">
          <h2 className="font-display text-base font-semibold dark:text-slate-100 text-slate-900">{title}</h2>
          <button onClick={onClose}
            className="p-1.5 rounded-lg dark:hover:bg-slate-700/60 hover:bg-slate-100 dark:text-slate-400 text-slate-500 transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  open: boolean; onClose: () => void; onConfirm: () => void | Promise<void>;
  title: string; message: string; confirmLabel?: string; danger?: boolean;
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Delete', danger = true }: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={title} width="max-w-md">
      <div className="flex gap-4 mb-6">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${danger ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
          <AlertTriangle size={18} className={danger ? 'text-red-500' : 'text-amber-500'} />
        </div>
        <p className="text-sm dark:text-slate-300 text-slate-600 leading-relaxed pt-2">{message}</p>
      </div>
      <div className="flex justify-end gap-2">
        <button className="btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
        <button className="btn-primary flex items-center gap-2" disabled={loading}
          style={{ backgroundColor: danger ? '#DC2626' : 'var(--color-primary)' }}
          onClick={handleConfirm}>
          {loading ? <Loader2 size={14} className="animate-spin" /> : null}
          {loading ? 'Deleting…' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
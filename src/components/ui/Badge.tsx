import type { Status } from '../../types';

const STATUS_STYLES: Record<Status, string> = {
  Active: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/30',
  Inactive: 'bg-slate-500/15 dark:text-slate-400 text-slate-500 ring-1 ring-slate-500/30',
  'On Leave': 'bg-orange-500/15 text-orange-600 dark:text-orange-400 ring-1 ring-orange-500/30',
};

const STATUS_DOT: Record<Status, string> = {
  Active: 'bg-emerald-400',
  Inactive: 'bg-slate-400',
  'On Leave': 'bg-orange-400',
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`badge ${STATUS_STYLES[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${STATUS_DOT[status]}`} />
      {status}
    </span>
  );
}

export function RoleBadge({ role }: { role: string }) {
  return (
    <span className="badge bg-blue-500/15 text-blue-600 ring-1 ring-blue-500/30">
      {role}
    </span>
  );
}
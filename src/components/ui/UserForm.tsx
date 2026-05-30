import { useState } from 'react';
import type { User, Role, Status } from '../../types';

const ROLES: Role[] = ['Admin', 'HR', 'Manager', 'Employee'];
const STATUSES: Status[] = ['Active', 'Inactive', 'On Leave'];
const DEPARTMENTS = ['Engineering', 'Human Resources', 'Product', 'Design', 'Sales', 'Marketing', 'Finance', 'Operations'];

interface UserFormProps {
  initial?: Partial<User>;
  onSubmit: (data: Omit<User, 'id'>) => void;
  onCancel: () => void;
  submitLabel?: string;
}

const avatarUrl = (name: string) =>
  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=4f63f3&fontFamily=Helvetica`;

export function UserForm({ initial = {}, onSubmit, onCancel, submitLabel = 'Save' }: UserFormProps) {
  const [form, setForm] = useState({
    name:       initial.name ?? '',
    email:      initial.email ?? '',
    phone:      initial.phone ?? '',
    role:       initial.role ?? 'Employee' as Role,
    department: initial.department ?? 'Engineering',
    status:     initial.status ?? 'Active' as Status,
    joinDate:   initial.joinDate ?? new Date().toISOString().split('T')[0],
    avatar:     initial.avatar ?? '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim())  e.name = 'Name is required';
    if (!form.email.includes('@')) e.email = 'Valid email required';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, avatar: avatarUrl(form.name) });
  };

  const Field = ({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) => (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field id="name" label="Full Name" error={errors.name}>
          <input id="name" className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="John Doe" />
        </Field>
        <Field id="email" label="Email Address" error={errors.email}>
          <input id="email" type="email" className="input" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="john@corp.io" />
        </Field>
        <Field id="phone" label="Phone" error={errors.phone}>
          <input id="phone" className="input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210" />
        </Field>
        <Field id="joinDate" label="Join Date">
          <input id="joinDate" type="date" className="input" value={form.joinDate} onChange={e => setForm(f => ({ ...f, joinDate: e.target.value }))} />
        </Field>
        <Field id="role" label="Role">
          <select id="role" className="input" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as Role }))}>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>
        <Field id="department" label="Department">
          <select id="department" className="input" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))}>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </Field>
        <Field id="status" label="Status">
          <select id="status" className="input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Status }))}>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
      </div>
      <div className="flex justify-end gap-2 pt-2 border-t border-slate-700/50">
        <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-primary">{submitLabel}</button>
      </div>
    </form>
  );
}

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { Employee, Status } from '../../types';

const STATUSES: Status[] = ['Active', 'Inactive', 'On Leave'];
const DEPARTMENTS = ['Engineering','Human Resources','Product','Design','Sales','Marketing','Finance','Operations','Legal','Customer Success'];
const DESIGNATIONS = ['Software Engineer','Senior Engineer','Staff Engineer','Engineering Manager','Product Manager','Designer','HR Manager','HR Specialist','Sales Manager','Account Executive','Finance Manager','Analyst','Operations Manager','Director','VP','Other'];

interface EmployeeFormProps {
  initial?: Partial<Employee>;
  onSubmit: (data: Omit<Employee, 'id' | 'created_at'>) => void | Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  saving?: boolean;
}

export function EmployeeForm({ initial = {}, onSubmit, onCancel, submitLabel = 'Save', saving = false }: EmployeeFormProps) {
  const [form, setForm] = useState({
    employee_id:  initial.employee_id  ?? '',
    first_name:   initial.first_name   ?? '',
    last_name:    initial.last_name    ?? '',
    email:        initial.email        ?? '',
    phone:        initial.phone        ?? '',
    department:   initial.department   ?? DEPARTMENTS[0],
    designation:  initial.designation  ?? DESIGNATIONS[0],
    joining_date: initial.joining_date ?? new Date().toISOString().split('T')[0],
    status:       (initial.status      ?? 'Active') as Status,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!form.first_name.trim())   e.first_name = 'Required';
    if (!form.last_name.trim())    e.last_name  = 'Required';
    if (!form.email.includes('@')) e.email      = 'Valid email required';
    if (!form.phone.trim())        e.phone      = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const Field = ({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) => (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field id="employee_id" label="Employee ID">
          <input id="employee_id" className="input" value={form.employee_id} onChange={set('employee_id')} placeholder="EMP-001" />
        </Field>
        <Field id="joining_date" label="Joining Date">
          <input id="joining_date" type="date" className="input" value={form.joining_date} onChange={set('joining_date')} />
        </Field>
        <Field id="first_name" label="First Name" error={errors.first_name}>
          <input id="first_name" className="input" value={form.first_name} onChange={set('first_name')} placeholder="Arjun" autoFocus />
        </Field>
        <Field id="last_name" label="Last Name" error={errors.last_name}>
          <input id="last_name" className="input" value={form.last_name} onChange={set('last_name')} placeholder="Mehta" />
        </Field>
        <Field id="email" label="Email Address" error={errors.email}>
          <input id="email" type="email" className="input" value={form.email} onChange={set('email')} placeholder="arjun@corp.io" />
        </Field>
        <Field id="phone" label="Phone" error={errors.phone}>
          <input id="phone" className="input" value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" />
        </Field>
        <Field id="department" label="Department">
          <select id="department" className="input" value={form.department} onChange={set('department')}>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </Field>
        <Field id="designation" label="Designation">
          <select id="designation" className="input" value={form.designation} onChange={set('designation')}>
            {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </Field>
        <Field id="status" label="Status">
          <select id="status" className="input" value={form.status}
            onChange={e => setForm(f => ({ ...f, status: e.target.value as Status }))}>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
      </div>
      <div className="flex justify-end gap-2 pt-3 dark:border-slate-700/50 border-slate-200 border-t">
        <button type="button" className="btn-ghost" onClick={onCancel} disabled={saving}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? <Loader2 size={14} className="animate-spin" /> : null}
          {saving ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
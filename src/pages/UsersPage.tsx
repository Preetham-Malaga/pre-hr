import { useState, useMemo } from 'react';
import { Plus, Search, Pencil, Trash2, Filter, ChevronUp, ChevronDown } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { RoleBadge, StatusBadge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { UserForm } from '../components/ui/UserForm';
import { useUsers } from '../context/UsersContext';
import type { User, Role } from '../types';

type SortKey = keyof Pick<User, 'name' | 'email' | 'role' | 'department' | 'status' | 'joinDate'>;

const ROLES: ('All' | Role)[] = ['All', 'Admin', 'HR', 'Manager', 'Employee'];

export default function UsersPage() {
  const { users, addUser, updateUser, deleteUser } = useUsers();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | Role>('All');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const [addOpen, setAddOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const deleteTarget = users.find(u => u.id === deleteId);

  const filtered = useMemo(() => {
    return users
      .filter(u => {
        const q = search.toLowerCase();
        const matchSearch =
          !q ||
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.department.toLowerCase().includes(q);
        const matchRole = roleFilter === 'All' || u.role === roleFilter;
        return matchSearch && matchRole;
      })
      .sort((a, b) => {
        const av = a[sortKey], bv = b[sortKey];
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      });
  }, [users, search, roleFilter, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k
      ? sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />
      : <ChevronUp size={13} className="opacity-0 group-hover:opacity-30" />;

  const TH = ({ label, k }: { label: string; k: SortKey }) => (
    <th
      className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer select-none group hover:text-slate-200 transition-colors"
      onClick={() => handleSort(k)}
    >
      <span className="flex items-center gap-1">{label}<SortIcon k={k} /></span>
    </th>
  );

  return (
    <>
      <Header title="User Management" subtitle={`${filtered.length} of ${users.length} employees`} />
      <div className="p-6 space-y-4">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-1 gap-2 max-w-lg">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                className="input pl-8 py-2"
                placeholder="Search by name, email, or department…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <select
                className="input pl-8 pr-8 py-2 appearance-none"
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value as typeof roleFilter)}
              >
                {ROLES.map(r => <option key={r} value={r}>{r === 'All' ? 'All Roles' : r}</option>)}
              </select>
            </div>
          </div>
          <button className="btn-primary shrink-0" onClick={() => setAddOpen(true)}>
            <Plus size={15} />
            Add Employee
          </button>
        </div>

        {/* Table */}
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/50 bg-slate-800/40">
                  <TH label="Employee" k="name" />
                  <TH label="Role"     k="role" />
                  <TH label="Department" k="department" />
                  <TH label="Status"  k="status" />
                  <TH label="Joined"  k="joinDate" />
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-slate-500 text-sm">
                      No employees match your search.
                    </td>
                  </tr>
                ) : filtered.map(user => (
                  <tr key={user.id} className="table-row-hover">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={user.name} size="sm" />
                        <div className="min-w-0">
                          <p className="font-medium text-slate-200 truncate">{user.name}</p>
                          <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><RoleBadge role={user.role} /></td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{user.department}</td>
                    <td className="px-4 py-3"><StatusBadge status={user.status} /></td>
                    <td className="px-4 py-3 text-slate-500 text-xs font-mono">
                      {new Date(user.joinDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          className="p-1.5 rounded-lg hover:bg-slate-700/60 text-slate-500 hover:text-brand-300 transition-colors"
                          onClick={() => setEditUser(user)}
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors"
                          onClick={() => setDeleteId(user.id)}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length > 0 && (
            <div className="px-4 py-3 border-t border-slate-700/30 text-xs text-slate-500">
              Showing {filtered.length} employee{filtered.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add New Employee" width="max-w-2xl">
        <UserForm
          onSubmit={data => { addUser(data); setAddOpen(false); }}
          onCancel={() => setAddOpen(false)}
          submitLabel="Add Employee"
        />
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editUser} onClose={() => setEditUser(null)} title="Edit Employee" width="max-w-2xl">
        {editUser && (
          <UserForm
            initial={editUser}
            onSubmit={data => { updateUser({ ...data, id: editUser.id }); setEditUser(null); }}
            onCancel={() => setEditUser(null)}
            submitLabel="Save Changes"
          />
        )}
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteUser(deleteId)}
        title="Delete Employee"
        message={`Are you sure you want to delete ${deleteTarget?.name ?? 'this employee'}? This action cannot be undone.`}
      />
    </>
  );
}

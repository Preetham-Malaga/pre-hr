// src/pages/RolesPermissions.tsx

import { useState } from 'react'
import {
  useRoles, usePermissions, useRolePermissions,
  useCreateRole, useUpdateRole, useDeleteRole, useSaveRolePermissions
} from '../hooks/useRoles'
import type { Role, RoleInsert } from '../types/role'

const MODULES = ['dashboard','employees','departments','designations','leave_management','settings']

export default function RolesPermissions() {
  const { data: roles = [], isLoading } = useRoles()
  const { data: permissions = [] } = usePermissions()
  const createRole = useCreateRole()
  const updateRole = useUpdateRole()
  const deleteRole = useDeleteRole()
  const savePerms = useSaveRolePermissions()

  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Role | null>(null)
  const [form, setForm] = useState<RoleInsert>({ role_name: '', description: '' })
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null)

  const { data: rolePermIds = [] } = useRolePermissions(selectedRole?.id ?? '')
  const [checkedPerms, setCheckedPerms] = useState<Set<string>>(new Set())

  function openCreate() { setEditing(null); setForm({ role_name: '', description: '' }); setShowModal(true) }
  function openEdit(r: Role) { setEditing(r); setForm({ role_name: r.role_name, description: r.description ?? '' }); setShowModal(true) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editing) await updateRole.mutateAsync({ id: editing.id, ...form })
    else await createRole.mutateAsync(form)
    setShowModal(false)
  }

  function selectRole(r: Role) {
    setSelectedRole(r)
    setCheckedPerms(new Set(rolePermIds))
  }

  // sync checked when rolePermIds loads
  function togglePerm(pid: string) {
    setCheckedPerms(prev => {
      const next = new Set(prev)
      if (next.has(pid)) next.delete(pid); else next.add(pid)
      return next
    })
  }

  async function handleSavePerms() {
    if (!selectedRole) return
    await savePerms.mutateAsync({ roleId: selectedRole.id, permissionIds: Array.from(checkedPerms) })
  }

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Roles & Permissions</h1>
        <button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">+ Add Role</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roles list */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-2">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Roles</h2>
          {roles.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No roles found</p>
          ) : roles.map(r => (
            <div key={r.id}
              onClick={() => selectRole(r)}
              className={`p-3 rounded-lg cursor-pointer flex items-center justify-between transition ${
                selectedRole?.id === r.id
                  ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent'
              }`}>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{r.role_name}</p>
                <p className="text-xs text-gray-500">{r.description || '—'}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={e => { e.stopPropagation(); openEdit(r) }} className="text-blue-500 hover:underline text-xs p-1">Edit</button>
                <button onClick={e => { e.stopPropagation(); setDeleteTarget(r) }} className="text-red-500 hover:underline text-xs p-1">Del</button>
              </div>
            </div>
          ))}
        </div>

        {/* Permissions matrix */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          {!selectedRole ? (
            <div className="flex items-center justify-center h-48 text-gray-400">
              <p className="text-sm">Select a role to manage permissions</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Permissions for: {selectedRole.role_name}</h2>
                <button onClick={handleSavePerms} disabled={savePerms.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-50">
                  {savePerms.isPending ? 'Saving...' : 'Save Permissions'}
                </button>
              </div>
              <div className="space-y-4">
                {MODULES.map(mod => {
                  const modPerms = permissions.filter(p => p.module === mod)
                  return (
                    <div key={mod}>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{mod.replace('_',' ')}</p>
                      <div className="flex flex-wrap gap-2">
                        {modPerms.map(p => (
                          <label key={p.id} className="flex items-center gap-2 cursor-pointer bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
                            <input type="checkbox"
                              checked={checkedPerms.has(p.id)}
                              onChange={() => togglePerm(p.id)}
                              className="rounded" />
                            <span className="text-xs text-gray-700 dark:text-gray-300">{p.action}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{editing ? 'Edit Role' : 'Add Role'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role Name *</label>
                <input required value={form.role_name} onChange={e => setForm(f => ({...f, role_name: e.target.value}))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <input value={form.description ?? ''} onChange={e => setForm(f => ({...f, description: e.target.value}))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300">Cancel</button>
                <button type="submit" disabled={createRole.isPending || updateRole.isPending}
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50">
                  {createRole.isPending || updateRole.isPending ? 'Saving...' : editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Delete Role</h2>
            <p className="text-sm text-gray-500 mb-6">Delete <strong>{deleteTarget.role_name}</strong>? This will remove all its permissions.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300">Cancel</button>
              <button onClick={async () => { await deleteRole.mutateAsync(deleteTarget.id); setDeleteTarget(null); if (selectedRole?.id === deleteTarget.id) setSelectedRole(null) }}
                disabled={deleteRole.isPending} className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50">
                {deleteRole.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
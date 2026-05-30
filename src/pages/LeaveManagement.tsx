// src/pages/LeaveManagement.tsx

import { useState, useMemo } from 'react'
import { useLeaveRequests, useLeaveTypes, useApplyLeave, useUpdateLeaveStatus, useCancelLeave, useUpdateLeaveRequest } from '../hooks/useLeave'
import { useEmployees } from '../hooks/useEmployee'
import type { LeaveRequest, LeaveRequestInsert } from '../types/leave'

const emptyForm: LeaveRequestInsert = { employee_id: '', leave_type_id: '', from_date: '', to_date: '', reason: '' }

type TabType = 'all' | 'pending' | 'approved' | 'rejected'

export default function LeaveManagement() {
  const { data: requests = [], isLoading, isError } = useLeaveRequests()
  const { data: leaveTypes = [] } = useLeaveTypes()
  const { data: employees = [] } = useEmployees()
  const applyLeave = useApplyLeave()
  const updateStatus = useUpdateLeaveStatus()
  const cancelLeave = useCancelLeave()
  const updateLeave = useUpdateLeaveRequest()

  const [tab, setTab] = useState<TabType>('all')
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState<LeaveRequest | null>(null)
  const [form, setForm] = useState<LeaveRequestInsert>(emptyForm)
  const [cancelTarget, setCancelTarget] = useState<LeaveRequest | null>(null)

  const counts = useMemo(() => ({
    all: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  }), [requests])

  const filtered = useMemo(() =>
    tab === 'all' ? requests : requests.filter(r => r.status === tab),
  [requests, tab])

  function openApply() { setEditTarget(null); setForm(emptyForm); setShowModal(true) }
  function openEdit(r: LeaveRequest) {
    setEditTarget(r)
    setForm({ employee_id: r.employee_id, leave_type_id: r.leave_type_id ?? '', from_date: r.from_date, to_date: r.to_date, reason: r.reason ?? '' })
    setShowModal(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editTarget) await updateLeave.mutateAsync({ id: editTarget.id, ...form })
    else await applyLeave.mutateAsync(form)
    setShowModal(false)
  }

  const statusColor = (s: string) => {
    if (s === 'approved') return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
    if (s === 'rejected') return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
    return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
  }

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>
  if (isError) return <div className="p-8 text-center text-red-500">Failed to load leave requests.</div>

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Leave Management</h1>
        <button onClick={openApply} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">+ Apply Leave</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(['all','pending','approved','rejected'] as TabType[]).map(s => (
          <div key={s} onClick={() => setTab(s)}
            className={`p-4 rounded-xl border cursor-pointer transition ${
              tab === s ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}>
            <p className="text-xs text-gray-500 capitalize mb-1">{s === 'all' ? 'Total Requests' : `${s} Leaves`}</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{counts[s]}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">No leave data available</p>
          <p className="text-sm mt-1">{tab !== 'all' ? `No ${tab} leave requests` : 'Apply a leave to get started'}</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
              <tr>
                {['Employee','Leave Type','From','To','Days','Reason','Status','Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.map(r => {
                const days = r.from_date && r.to_date
                  ? Math.ceil((new Date(r.to_date).getTime() - new Date(r.from_date).getTime()) / 86400000) + 1
                  : '—'
                return (
                  <tr key={r.id} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 dark:text-white">{r.employees?.first_name} {r.employees?.last_name}</p>
                      <p className="text-xs text-gray-400">{r.employees?.employee_id}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{r.leave_types?.leave_name || '—'}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{r.from_date}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{r.to_date}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{days}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{r.reason || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(r.status)}`}>{r.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {r.status === 'pending' && (
                          <>
                            <button onClick={() => updateStatus.mutateAsync({ id: r.id, status: 'approved' })} className="text-green-600 hover:underline text-xs">Approve</button>
                            <button onClick={() => updateStatus.mutateAsync({ id: r.id, status: 'rejected' })} className="text-red-500 hover:underline text-xs">Reject</button>
                            <button onClick={() => openEdit(r)} className="text-blue-500 hover:underline text-xs">Edit</button>
                            <button onClick={() => setCancelTarget(r)} className="text-gray-400 hover:underline text-xs">Cancel</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Apply/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{editTarget ? 'Edit Leave Request' : 'Apply Leave'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employee *</label>
                <select required value={form.employee_id} onChange={e => setForm(f => ({...f, employee_id: e.target.value}))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">— Select Employee —</option>
                  {employees.map(e => <option key={e.id} value={e.id}>{e.first_name} {e.last_name} ({e.employee_id})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Leave Type *</label>
                <select required value={form.leave_type_id} onChange={e => setForm(f => ({...f, leave_type_id: e.target.value}))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">— Select Type —</option>
                  {leaveTypes.map(t => <option key={t.id} value={t.id}>{t.leave_name} ({t.leave_days} days/yr)</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From *</label>
                  <input type="date" required value={form.from_date} onChange={e => setForm(f => ({...f, from_date: e.target.value}))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To *</label>
                  <input type="date" required value={form.to_date} onChange={e => setForm(f => ({...f, to_date: e.target.value}))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason</label>
                <textarea rows={3} value={form.reason ?? ''} onChange={e => setForm(f => ({...f, reason: e.target.value}))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300">Cancel</button>
                <button type="submit" disabled={applyLeave.isPending || updateLeave.isPending}
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50">
                  {applyLeave.isPending || updateLeave.isPending ? 'Saving...' : editTarget ? 'Update' : 'Apply'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Confirm */}
      {cancelTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Cancel Leave Request</h2>
            <p className="text-sm text-gray-500 mb-6">This will permanently cancel this leave request.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setCancelTarget(null)} className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300">Back</button>
              <button onClick={async () => { await cancelLeave.mutateAsync(cancelTarget.id); setCancelTarget(null) }}
                disabled={cancelLeave.isPending} className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50">
                {cancelLeave.isPending ? 'Cancelling...' : 'Cancel Leave'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}